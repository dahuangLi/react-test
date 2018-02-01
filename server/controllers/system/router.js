
var path = require("path"),
Router = require('koa-router'),
router = new Router().prefix('/api'),
systemService = require(path.join(process.cwd(), "/service/system/service"))();


/**
 * 角色管理查询
 */
router.post("/getRoleManagementData", async function(ctx){
    var reqData = ctx.request.body;
    reqData["token"] = ctx.session.token;
    var result = await systemService.roleList(reqData);
    ctx.response.body = result;
});

module.exports = router;