/**
 * Created by ly on 15-7-10.
 */
var http = require("http"),
    querystring = require("querystring"),
    extend = require("extend"),
    coRequest = require("co-request"),
    request = require('request'),
    messageUtil = require("./MessageUtil")(),
    rp = require('request-promise'),
    log = require("../log/boleLog").boleLog;
    fs = require('fs');
var transmit = function(options,callbak){
    var postData = querystring.stringify(options.postData);
    var configuration = {
        hostname: "",
        port: 80,
        path: "",
        method: "GET",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length
        }
    };

    configuration = extend(true,configuration, options.configuration);

    var req = http.request(configuration, function(res) {
        var resData = "";
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            resData += chunk;
        });
        res.on('end',function(){
            callbak(resData);
        });
    });

    req.on('error', function(e) {
        this.throw(500,"problem with request: " + e.message);
    });

    req.write(postData);
    req.end();
}

/**
 * 自实现的co包装函数
 * @returns {Function}
 */
var dispatch = function(){
    return function(fn){
        request('http://www.baidu.com', fn);
    }
}

/**
 * request的co包装器
 * @returns {*}
 */
function transfer(options,next){
    var param = {
        uri: options.uri,
        method: options.method,
        form: options.params,
        formData: options.formData
    };
    var result =  coRequest(param);
    log.info(param);
    log.info(result.body);
    try{
        if(typeof result.body === "string"){
            result.body = JSON.parse(result.body);
        }
    }catch(e){
        result.body = {
            errorCode : "SYS.0000"
        }
    }
    //处理用户token在服务器端过期
    if(result.body.errorCode){
        if("user.0032" === result.body.errorCode){
            throw new Error("user.0032");
        }
        var tmpMessage = messageUtil.getMessage(result.body.errorCode);
        if(tmpMessage){
            result.body.errorMessage = tmpMessage;
        }
    }
    return result
}

function transferSet(options, next){
    var readableStream = fs.createReadStream(options.body);
    var data = '';
    var chunk;
    readableStream.on('readable', function(){
        while ((chunk = readableStream.read()) != null) {
            data += chunk;
        }
    });
    var params = {
        uri: options.uri,
        data: {
            header:{
                'Content-Type': 'application/octet-stream'
            },
            body: readableStream.on('end',function(){})
        }
    };
    var result = require('got').post(params.uri, params.data).then(response => {
        return response;
    }).catch(error => {
        return {isSuccess: 0, errorInfo: {errorCode: 'SYS.0000'}};
    });
    return result;
}
// ======================================================================================================

/**
 * request文件下载
 * @param options
 * @param filepath
 * @returns {Promise}
 */
function requestPipToFile(options, filepath, res) {
    return new Promise(function(resolve, reject) {
        try {
            var stream = fs.createWriteStream(filepath);
            stream.on('finish', function() {
                //res.end();
                return resolve({
                    body: "{\"status\": \"SUCCESS\"}"
                });
            });
            /*stream.on("data", function(){
             if (res.write(chunk) === false) {
             res.pause();
             }
             });
             res.on('drain', function() {
             stream.resume();
             });*/
            return request({
                uri: options.uri,
                method: options.method,
                body : options.params,
                headers:{
                    'Content-Type': 'application/octet-stream'
                }
            }).pipe(stream);
        } catch (e) {
            return reject(e);
        }
    });
}

/**
 * 文件下载
 * @param options
 * @param fileName
 * @returns {*}
 */
function streamTransfer(options,fileName,res){
    var result = (requestPipToFile(options, fileName,res));
    log.info(result);
    try{
        if(typeof result.body === "string"){
            result.body = JSON.parse(result.body);
        }
    }catch(e){
        result.body = {
            errorCode : "SYS.0000"
        }
    }
    //处理用户token在服务器端过期
    if("user.0032" === result.body.errorCode){
        throw new Error("user.0032");
    }
    if(result.body.errorCode){
        var tmpMessage = messageUtil.getMessage(result.body.errorCode);
        if(tmpMessage){
            result.body.errorMessage = tmpMessage;
        }
    }
    return result
}

/**
 * request文件下载
 * @param options
 * @param filepath
 * @returns {Promise}
 */
function requestPipToFilePost(options, filepath, res) {
    return new Promise(function(resolve, reject) {
        try {
            var stream = fs.createWriteStream(filepath);
            stream.on('finish', function() {
                //res.end();
                return resolve({
                    body: "{\"status\": \"SUCCESS\"}"
                });
            });
            /*stream.on("data", function(){
             if (res.write(chunk) === false) {
             res.pause();
             }
             });
             res.on('drain', function() {
             stream.resume();
             });*/
            return request({
                uri: options.uri,
                method: options.method,
                body : options.params,
                headers:{
                    'Content-Type': 'application/json',
                    'Accept': 'application/octet-stream'
                },
                json:true
            }).pipe(stream);
        } catch (e) {
            return reject(e);
        }
    });
}

/**
 * 文件下载
 * @param options
 * @param fileName
 * @returns {*}
 */
function streamAjaxTransfer(options,fileName,res){
    log.info(options);
    var result = (requestPipToFilePost(options, fileName,res));
    log.info(result);
    try{
        if(typeof result.body === "string"){
            result.body = JSON.parse(result.body);
        }
    }catch(e){
        result.body = {
            errorCode : "SYS.0000"
        }
    }
    //处理用户token在服务器端过期
    if("user.0032" === result.body.errorCode){
        throw new Error("user.0032");
    }
    if(result.body.errorCode){
        var tmpMessage = messageUtil.getMessage(result.body.errorCode);
        if(tmpMessage){
            result.body.errorMessage = tmpMessage;
        }
    }
    return result
}

/**
 * GET 提交
 * Content-type: application/x-www-form-urlencoded
 * @constructor
 */
function GET(options){

}

async function ajaxTransfer(options){
    var _this = this;
    var param = {
        uri: options.uri,
        method: options.method,
        body : options.params,
        json: true
    };

    var options = {
        method: 'POST',
        uri: options.uri,
        body: options.params,
        json: true
    };
    console.log(options);
    var response

    return  await rp(options)
            .then(function (parsedBody) {
                console.log(parsedBody)
                return  response = parsedBody;
            })
            .catch(function (err) {
                response = err;
            });
}



module.exports = {
    transmit: transmit,
    dispatch: dispatch,
    transfer: transfer,
    ajaxTransfer : ajaxTransfer,
    streamTransfer:streamTransfer,
    streamAjaxTransfer:streamAjaxTransfer,
    transferSet:transferSet,
};