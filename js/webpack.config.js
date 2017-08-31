var webpack = require('webpack');
module.exports = {
    entry: './entry.js',
    output: {
        path: __dirname,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {test: /\.css$/,loader: 'style-loader!css-loader'},
            { test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/, loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]'},
            { test: /\.png$/, loader: "file-loader?name=images/[hash:8].[name].[ext]" }
        ]
    },
    plugins: [
        new webpack.BannerPlugin('this file is created by btea')
    ]
}