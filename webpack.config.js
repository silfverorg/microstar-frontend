var path = require("path");
module.exports = {
entry: {
app: ["./src/main.js"]
       },
output: {
        path: path.resolve(__dirname, "build"),
      filename: "bundle.js"
        },
 module: {
    loaders: [
         {
            test: /\.js$/,
           exclude: /node_modules/,
           loaders: ['babel-loader']
         },
     ]
 }

};
