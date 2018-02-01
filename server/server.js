"use strict"


const  http = require("http"),
    path = require("path"),
    koa = require("koa"),
    fs = require("fs"),
    bodyParser = require('koa-bodyparser'),
    serve = require("koa-static"),
    render = require("koa-ejs"),
    envPath = 'static',
    staticCache = require('koa-static-cache'),
    historyFallback = require('koa2-history-api-fallback'),
    Router = require('koa-router');

// const webpack = require("webpack");
// const webpackDistConfig = require("../config/webpack.redist");



// const devMiddleware = require("./devMiddleware");
// const hotMiddleware = require('./hotMiddleware');


// const compilerDist = webpack(webpackDistConfig);



const app = new koa();
app.use(bodyParser());
const router = new Router();
app.listen(3060);

app.use(staticCache("../dist/static"),{
    maxAge: 365 * 24 * 60 * 60
  });


app.use(devMiddleware(compilerDist));
app.use(hotMiddleware(compilerDist));

app.use(serve("../dist/static",{index: false}));
render(app, {
    root: path.join('../dist/static'),
    layout: false,
    viewExt: 'html',
    cache: false,
    debug: true
});

app.use(async function (ctx) {
    console.log("-----------------------------------")
    await ctx.render('login');
});

// app.use(function *(next) {
//     if(process.env.NODE_ENV == 'development'){
//         const envPath = '../dist/static';
//     } else {
//         const envPath = 'static';
//     }
//     yield next;
// });


app.use(historyFallback({
    index: '/index.html'
}));


router.post('/api/login', function (ctx, next) {
    ctx.response.body = {
        status:"1"
    };
});

app.use(router.routes());


app.use(router.allowedMethods());

console.log("http://localhost:"+3060);