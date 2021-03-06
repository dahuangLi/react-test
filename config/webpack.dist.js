var webpack = require("webpack");
var path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        index: './src/router.jsx',
        login: './src/login.jsx'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '../dist/static')
    },
    module:{
        rules : [
            {
                test: /\.js[x]?$/,
                use: [{
                    loader: 'babel-loader',
                    query: {
                        presets: ['react', 'es2015', 'stage-0'],
                        plugins: [
                            ['react-hot-loader/babel'],
                            ["import", {"libraryName": "antd", "style": "css"}]
                        ] // antd 按需加载
                    },
                }],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader","autoprefixer-loader?browsers=last 2 version"]
                })
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'less-loader','autoprefixer-loader?browsers=last 2 version']
                })
            },
            {
                // .scss或.css文件使用下面的loader
                test: /\.(scss)$/,
                // loader使用顺序，autoprefixer-loader?browsers=last 2 version --> sass-loader  --> css-loader --> style-loader
                use:ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader',"autoprefixer-loader?browsers=last 2 version"]
                })
            },
            {
                //正则匹配后缀.png、.jpg、.gif图片文件;
                test: /\.(png|jpg|gif)$/i,
                use: [
                    {
                        //加载url-loader 同时安装 file-loader;
                        loader : 'url-loader',
                        options : {
                            //小于10000K的图片文件转base64到css里,当然css文件体积更大;
                            limit : 10000,
                            //设置最终img路径;
                            name : 'images/[name]-[hash].[ext]'
                        }
                    },
                    {
                        //压缩图片(另一个压缩图片：image-webpack-loader);
                        loader : 'img-loader?minimize&optimizationLevel=5&progressive=true'
                    },

                ]
            }
        ]
    },
    resolve: {
        extensions: ['.less', '.js', '.jsx'],
        modules: [
            'node_modules',
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, '../dist')
        ],
    },
    plugins: [
        new CleanWebpackPlugin(['../dist']),
        new ExtractTextPlugin('css/main.css'),
    ]
};