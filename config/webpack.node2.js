'use strict';

const webpack = require('webpack');
var path = require("path")

let externals = _externals();

module.exports = {
    entry: {
        app: './server/server.koa.js',
    },
    target: 'node',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.js']
    },
    externals: externals,
    node: {
        console: true,
        global: true,
        process: true,
        Buffer: true,
        __filename: true,
        __dirname: true,
        setImmediate: true
    },
    module: {
        rules:[
            {
                test: /\.js[x]?$/,
                use: [{
                    loader: 'babel-loader',
                    query: {
                        presets: ['react', 'es2015', 'stage-0'],
                    },
                }],
                exclude: /node_modules/
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: 'file-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(eot|woff|svg|ttf|woff2|gif|appcache|mp3)(\?|$)/,
                exclude: /node_modules/,
                use: 'file-loader?name=[name].[ext]',
            },
        ]
    }
};

function _externals() {
    let manifest = require('../package.json');
    let dependencies = manifest.dependencies;
    let externals = {};
    for (let p in dependencies) {
        externals[p] = 'commonjs ' + p;
    }
    return externals;
}