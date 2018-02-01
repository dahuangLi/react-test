/**
 * Created by yong.liu on 2015/9/18.
 */
var path = require("path"),
    Router = require('koa-router'),
    router = new Router().prefix('/api'),
    adminServerService = require(path.join(process.cwd(), "/service/adminServer/service"))();


/**
 * 登录
 * 
 */
router.post('/login', async function (ctx, next) {
    console.log(ctx.request.body);
    var reqData = ctx.request.body;
    var phoneNum = reqData.userName;
    var loginPwd = reqData.password;
    var result;
    result = await adminServerService.login({phoneNum: phoneNum, loginPwd: loginPwd});

    if (result.status == "SUCCEED") {
        ctx.session.userName = phoneNum;
        ctx.session.loginPwd = loginPwd;
        ctx.session.token = result.data.token;
        ctx.session.children  = result.data.menus.children;
        ctx.session.roleName = result.data.userInfo.username;
        ctx.body = {
            status: true,
            userName: result.data.userInfo.username
        };
    } else if (result.status == "FAILED") {
        ctx.response.body = result;
    } else {
        ctx.body = {
            status: false,
            errorCode: "USER.0001",
            errorMessage: "login failed",
            errorMessageZh: "登录失败"
        }
    }
});

/**
 * 获取菜单数据
 */
router.post("/getMenus", async function(ctx) {
    ctx.response.body = {
        status: "SUCCEED",
        menus: ctx.session.children,
        roleName:ctx.session.roleName
    };
});

/**
 * 获取菜单数据
 */
router.post("/loginOut", async function(ctx) {
    ctx.session = null;
    ctx.response.body = {
        status: "SUCCEED"
    };
});

/**
 * 修改密码
 */
router.post("/resetPasswd", async function(ctx,next) {
    var reqData = ctx.request.body;
    reqData.token = ctx.session.token;
    var result = await adminServerService.changePassword(reqData);
    ctx.session = null;
    ctx.response.body = result;
});

module.exports = router;