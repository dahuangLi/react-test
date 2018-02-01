
var path = require("path"),
    request = require(path.join(process.cwd(), "common/util/request")),
    signUrl = require(path.join(process.cwd(), "common/util/signurl")),
    config = require(path.join(process.cwd(), "config")),
    uid = require('rand-token').uid;

function systemService(args){
    if(!(this instanceof systemService)){
        return new systemService(args);
    }
}

/** 
 *  角色管理查询
 * */

systemService.prototype.roleList = async function (reqData) {
    var url = await signUrl("roleListfindServer", {token: reqData["token"], pageIndex: reqData.pageIndex, pageSize: reqData.pageSize}, "list");
    delete reqData.token;
    var result = await request.ajaxTransfer({uri: url, method: "POST", params: reqData});
    return result;
};

module.exports = systemService;