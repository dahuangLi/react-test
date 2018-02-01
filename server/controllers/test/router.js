/**
 * Created by yong.liu on 2015/9/18.
 */
var path = require("path"),
    Router = require('koa-router'),
    router = new Router().prefix('/api'),
    adminServerService = require(path.join(process.cwd(), "/service/adminServer/service"))();

router.post('/test', function (ctx, next) {
    console.log(ctx.request.body);
    ctx.response.body = {Func:"test"};
});


module.exports = router;