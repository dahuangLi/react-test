
var path = require("path"),
    request = require(path.join(process.cwd(), "common/util/request")),
    signUrl = require(path.join(process.cwd(), "common/util/signurl")),
    config = require(path.join(process.cwd(), "config")),
    uid = require('rand-token').uid;

function adminServerService(args){
    if(!(this instanceof adminServerService)){
        return new adminServerService(args);
    }
}

/**
 * 登录
 * @param next
 */


 adminServerService.prototype.login = async function (params) {
    var url = signUrl("adminServerService",{},"login");
    const result = await request.ajaxTransfer({uri: url,method: "POST",params: params});
    return result;
};

/**
 * 修改密码NoToken
 * @param params
 * @returns {*}
 */
adminServerService.prototype.changePassword = async function (params) {
    var url =await signUrl("adminServerService",{token:params.token},"resetPasswd");

    delete params.token;
    delete params.newPasswordSure;
    var result = await request.ajaxTransfer({uri: url,method: "POST", params: params});
    return result;
};

module.exports = adminServerService;