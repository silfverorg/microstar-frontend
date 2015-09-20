import React from 'react';
import R from 'ramda';
import { Router, Route, Link } from 'react-router';
import { createStore } from 'redux';

// types. addUser
function test(state, action) {
    return {
        users: []
    };
}
function addUser(state, action) {
    if (action.type === 'addUser') {
        return { 
            users: [ {
                id: 1,
                name: 'niklas',
            }]
        };
    }
    return state;
}

let store = createStore(addUser);

class App extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        store.subscribe(this.onChange.bind(this));
    }

    onChange() {
        this.setState(store.getState());
    }

    addUser() {
        store.dispatch({
            type: 'addUser'
        });
    }

    buildUsers() {
        if (!this.state || !this.state.users || !this.state.users.length) { 
            return (<div>Inga användare</div>);
        }

        return R.map((user) => {
            return <div>{user.name}</div>
        }, this.state.users);
    }

    render() {
        console.error('state is now', this.state);
        return (
            <div>
                {this.buildUsers()}
                <br/>
                <a style={{ cursor: 'pointer' }} onClick={this.addUser}>addUser</a>
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
