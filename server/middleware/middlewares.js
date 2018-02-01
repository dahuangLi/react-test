/**
 * Created by ly on 2017/12/20.
 */
var path = require("path"),
    findFile = require("../common/util/findFile");

/**
 * 路由配置
 * @returns {*}
 */
function routers(){
    var mildArr = new Array();

    var files = findFile(process.cwd() + path.sep + path.sep + "controllers",/^router\.js$/);

    var endRouter = require("../controllers/adminRouter/router").routes();
    var baseRouterArray = require("../controllers/adminRouter/router").routes().router.stack;
    var addRouterArray = [];
    for(var k = 0;k < files.length;k++){
        for(var i = 0;i<require(files[k]).routes().router.stack.length;i++){
            addRouterArray.push(require(files[k]).routes().router.stack[i]);
        }
    }
    endRouter.router.stack = addRouterArray;
    return endRouter;
}

module.exports = routers;