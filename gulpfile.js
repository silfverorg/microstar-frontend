var webpack = require("webpack");
var gulp = require('gulp');


gulp.task('default', function() {
    // returns a Compiler instance
    webpack({
            entry: "./src/main",
            output: {
                path: __dirname + "/",
                filename: "bundle.js"
            }
    }, function(err, stats) {
    });
});
