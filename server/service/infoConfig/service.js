
var path = require("path"),
    request = require(path.join(process.cwd(), "common/util/request")),
    signUrl = require(path.join(process.cwd(), "common/util/signurl")),
    config = require(path.join(process.cwd(), "config")),
    uid = require('rand-token').uid;

function infoConfigService(args){
    if(!(this instanceof infoConfigService)){
        return new infoConfigService(args);
    }
}


/**
 * 通讯配置管理 实时配置  列表查询
 */
infoConfigService.prototype.changePassword = async function (params) {
    var url =await signUrl("configService",{token:params.token,pageIndex:params.pageIndex},"getIssueItemList");
    delete params.token;
    var result = await request.ajaxTransfer({uri: url,method: "POST", params: params});
    return result;
};

/**
 *  实时配置维护 状态更新
 * */

infoConfigService.prototype.updateIssueItemStatus = async function(reqData){
    var url = signUrl("configService",{token:reqData["token"]},"updateIssueItemStatus");
    delete reqData.token;
    var result = await request.ajaxTransfer({uri: url,method: "POST",params:reqData});
    return result;
};

/**
 *  实时配置维护 详情 表单
 * */

infoConfigService.prototype.getIssueItemDetail = async function(reqData){
    var url = signUrl("configService",{token:reqData["token"]},"getIssueItemDetail");
    delete reqData.token;
    var result = await request.ajaxTransfer({uri: url,method: "POST",params:reqData});
    return result;
};

/**
 *  实时配置维护 详情 表格
 * */

infoConfigService.prototype.getIssueSignalList = async function(reqData){
    var url = signUrl("configService",{token:reqData["token"]},"getIssueSignalList");
    delete reqData.token;
    var result = await request.ajaxTransfer({uri: url,method: "POST",params:reqData});
    return result;
};

// --  获取所有车型
infoConfigService.prototype.allServer = async function(reqData){
    var url = signUrl("getallService",{token:reqData["token"],modelName: reqData.modelName},"name");
    delete reqData.token;
    var result = await request.ajaxTransfer({uri: url,method: "POST",params:reqData});
    return result;
};

/**
 *  实时配置维护 根据车型获取信号列表
 * */

infoConfigService.prototype.getSignalListByVehicleMode = async function(reqData){
    var url = signUrl("configDbcService",{token:reqData["token"]},"getSignalListByVehicleMode");
    delete reqData.token;
    var result = await request.ajaxTransfer({uri: url,method: "POST",params:reqData});
    return result;
};

/**
 *  实时配置维护 新增配置
 * */

infoConfigService.prototype.addIssueItem = async function(reqData){
    var url = signUrl("configService",{token:reqData["token"]},"addIssueItem");
    delete reqData.token;
    var result = await request.ajaxTransfer({uri: url,method: "POST",params:reqData});
    return result;
};


module.exports = infoConfigService;