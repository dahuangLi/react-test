/**
 * Created by mx on 2015/11/18.
 */
var path = require("path"),
    explore = require("./explorePath");

function findFile(pathArr,filePattern){
    if(typeof pathArr == "string"){
        pathArr = [pathArr];
    }
    var matchFiles = [],
        filePaths = [];
    pathArr.forEach(function(pah,index,pathArr){
        filePaths = explore(pah);
        filePaths.forEach(function(file,fileIndex,files){
            var fileName = file.substr(file.lastIndexOf(path.sep) + 1);
            if(filePattern.test(fileName)){
                matchFiles.push(file);
            }
        });
    });
    return matchFiles;
}

module.exports = findFile;