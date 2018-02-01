/**
 * Created by mx on 2015/11/18.
 */

var fs = require("fs"),
    path = require('path');

function explorer(pth){
    var pathArr = [];
    var files = fs.readdirSync(pth);
    files.forEach(function(file){
        var nextPath = pth + path.sep + file;
        if(fs.lstatSync(nextPath).isDirectory()){
            pathArr = pathArr.concat(explorer(nextPath));
        }else{
            pathArr.push(nextPath);
        }
    });
    return pathArr;
}

module.exports = explorer;
