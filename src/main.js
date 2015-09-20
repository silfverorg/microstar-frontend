import React from 'react';
import R from 'ramda';
import moment from 'moment';
import { Router, Route, Link } from 'react-router';
import { createStore } from 'redux';

import {inspectedElement, users} from './data_mocks';

import FixedDataTable from 'fixed-data-table';
const Table = FixedDataTable.Table;
const Column = FixedDataTable.Column;

const defaultState = {
    users: users,
    inspectUser: null,
    visibleUsers: users,
    searchFilter: null,
};

// types. addUser
function mainReducer(state = defaultState, action) {
    function updateUsers() {
        const newUsers = R.reject((user) => {
            return user.name.indexOf(action.value);
        }, state.users);
        return Object.assign({}, state, {
            searchFilter: action.value,
            visibleUsers: newUsers,
        });
    }

    function flipUser(inspectUser, id) {
        // Ask for inspect here.
        if (inspectUser && inspectUser.id === id) {
            return null;
        } else {
            return R.find(R.propEq('id', id), inspectedElement);
        }
    }

    switch (action.type) {
        case 'USER_FLIP_INSPECT':
            return Object.assign({}, state, {
                inspectUser: flipUser(state.inspectUser, action.id)
            });
        case 'SEARCH_FILTER':
            return updateUsers();
        default: 
            return state;
    }
}

let store = createStore(mainReducer);

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = store.getState();
    }

    componentDidMount() {
        store.subscribe(this.onChange.bind(this));
    }

    onChange() {
        this.setState(store.getState());
    }

    addUser() {
        store.dispatch({
            type: 'ADD_USER'
        });
    }

    flipInspect(id) {
        store.dispatch({
            type: 'USER_FLIP_INSPECT',
            id: id
        });
    }

    buildUsers() {
        if (!this.state || !this.state.visibleUsers || !this.state.visibleUsers.length) { 
            return (<div>Inga användare</div>);
        }

        return R.map((user) => {
            return <div style={{cursor: 'pointer' }} onClick={this.flipInspect.bind(this, user.id)}>{user.name}</div>
        }, this.state.visibleUsers);
    }

    textChange(e) {
        const value = e.target.value;
        store.dispatch({
            type: 'SEARCH_FILTER',
            value: value,
        });
    }

    buildInspect() {
        const inspectUser = this.state.inspectUser;
        if (!inspectUser) return null;


        const labels = ['Event', 'Time', 'Userid', 'OS', 'URL'];
        function rowGetter(rowIndex) {
            const a = inspectUser.actions[rowIndex];
            const props = a.properties;
            console.error(props);
            const list =  [
                [a.event, moment.unix(props.time).format('YYYY-MM-DD hh:ss'), props.distinct_id, props.$os, props.$current_url]
            ];
            return list[0];
        }


        let count = -1;
        const buildActions = R.map((label) => {
            count++;
            return (
                <Column
                    label={label}
                    width={200}
                    dataKey={count}
                />
            );
        });

        const closeInspect = () => {
            store.dispatch({
                type: 'USER_FLIP_INSPECT',
                id: -1,
            });
        };

        return (
            <div>
                <h1>{inspectUser.name} === {inspectUser.id}</h1>
                <a style={{ cursor: 'pointer' }} onClick={closeInspect}>
                    Close
                </a>
                <Table
                rowHeight={50}
                rowGetter={rowGetter}
                rowsCount={inspectUser.actions.length}
                width={1000}
                height={700}
                headerHeight={50}>
                    {buildActions(labels)}
                </Table>
            </div>
        );
    }

    render() {
        const inspectElement = this.buildInspect();
        const usersElement   = this.buildUsers();
        return (
            <div>
                <input type='text' onChange={this.textChange} />
                { (inspectElement !== null) 
                ? inspectElement
                : usersElement
                }
                <br/>
            </div>
        );
    }
};

React.render((
    <Router>
        <Route path="/" component={App}>
        </Route>
    </Router>
), document.getElementById('content'));
