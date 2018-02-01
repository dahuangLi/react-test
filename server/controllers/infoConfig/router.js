
var path = require("path"),
    Router = require('koa-router'),
    router = new Router().prefix('/api'),
    infoConfigService = require(path.join(process.cwd(), "/service/infoConfig/service"))();


/**
 * 通讯配置管理 实时配置  列表查询
 */
router.post("/configFirst", async function(ctx) {
    var reqData = ctx.request.body;
    reqData.token = ctx.session.token;
    var result = await infoConfigService.changePassword(reqData);
    ctx.response.body = result;
});

// note 实时配置维护  状态更新
router.post("/updateIssueItemStatus", async function(ctx){
    var reqData = ctx.request.body;
    reqData["token"] = ctx.session.token;
    var result = await infoConfigService.updateIssueItemStatus(reqData);
    ctx.response.body = result;
});

// note 实时配置维护  详情 表单
router.post("/getIssueItemDetail", async function(ctx){
    var reqData = ctx.request.body;
    reqData["token"] = ctx.session.token;
    var result = await infoConfigService.getIssueItemDetail(reqData);
    ctx.response.body = result;
});

// note 实时配置维护  详情 表格 状态更新
router.post("/getIssueSignalList", async function(ctx){
    var reqData = ctx.request.body;
    reqData["token"] = ctx.session.token;
    var result = await infoConfigService.getIssueSignalList(reqData);
    ctx.response.body = result;
});

// --  获取所有车型
router.post("/allServer", async function(ctx){
    var reqData = ctx.request.body;
    reqData["token"] = ctx.session.token;
    var result = await infoConfigService.allServer(reqData);
    ctx.response.body = result;
});

// note 实时配置维护  根据车型获取信号列表
router.post("/getSignalListByVehicleMode", async function(ctx){
    var reqData = ctx.request.body;
    reqData["token"] = ctx.session.token;
    var result = await infoConfigService.getSignalListByVehicleMode(reqData);
    ctx.response.body = result;
});

// note 实时配置维护  新增配置
router.post("/addIssueItem", async function(ctx){
    var reqData = ctx.request.body;
    reqData["token"] = ctx.session.token;
    var result = await infoConfigService.addIssueItem(reqData);
    ctx.response.body = result;
});

/**
 * 获取按钮
 */
router.post("/getBtnServer", async function(ctx) {
    var meauAll = ctx.session.children;

    var btnArrData = {};
    for (var i = 0; i < meauAll.length; i++) {
        for (var k = 0; k < meauAll[i].children.length; k++) {
            btnArrData[meauAll[i].children[k].url] = meauAll[i].children[k].function;
        }
    }


    ctx.response.body = {
        status: "SUCCEED",
        btnArrData: btnArrData
    };

});

module.exports = router;