"use strict"

// process.env.DEBUG = '*,-not_this';

const  http = require("http"),
    path = require("path"),
    koa = require("koa"),
    fs = require("fs"),
    bodyParser = require('koa-bodyparser'),
    serve = require("koa-static"),
    staticCache = require('koa-static-cache'),
    render = require("koa-ejs"),
    session = require("koa-generic-session"),
    redisStore = require("koa-redis"),
    envPath = 'static',
    historyFallback = require('koa2-history-api-fallback'),
    config = require("./config"),
    middlewares = require("./middleware/middlewares"),
    Router = require('koa-router');


const webpack = require("webpack");
const webpackDistConfig = require("../config/webpack.server");

const devMiddleware = require("./devMiddleware");
const hotMiddleware = require('./hotMiddleware');

const compilerDist = webpack(webpackDistConfig);

const app = new koa();
app.use(bodyParser());


app.keys = ["koa-react"];
app.use(session({
    store: redisStore({
        host: config.redis.hostname,
        prot: config.redis.port,
        socket: config.redis.socket,
        db: config.redis.db,
        pass: config.redis.pass
    }),
    cookie : {
        path: "/",
        httpOnly: true,
        maxage: 7200000,
        rewrite: true,
        signed: true
    },
    ttl : null
}));

app.use(require("./controllers/adminRouter/router").routes());

app.use(devMiddleware(compilerDist));
app.use(hotMiddleware(compilerDist));

app.use(staticCache("../dist/static"));

app.use(serve("../dist/static",{index: false}));
render(app, {
    root: path.join('../dist/static'),
    layout: false,
    viewExt: 'html',
    cache: false,
    debug: true
});
app.use(async function (ctx,next) {
    if(/^\/api\//.test(ctx.request.url)){
        if(ctx.session.userName){
            await next();
            console.log("---------------------------")
            console.log(ctx)
            console.log("---------------------------")
            app.use(middlewares());
        } else {
            app.use(middlewares());
            console.log("+++++++++++++++++++++++++++++")
            await ctx.render('login');
        }
    } else {
        // 刷新控制
        if(ctx.session.userName){
            await ctx.render('index');
        } else {
            await ctx.render('login');
        }
    }
});


app.use(middlewares());

app.listen(3063);
console.log("http://localhost:"+3063);