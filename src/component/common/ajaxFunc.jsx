import  axios from 'axios';

export const AjaxPostFunc = (tparams) => {
    return new Promise(function (resolve, reject) {
        axios({
            method:tparams.method,
            url:tparams.url,
            data:tparams.params
        })
        .then(function(res){
            if(res.data.status == "SUCCEED"){
                for(var i = 0;i<res.data.data.length;i++){
                    res.data.data[i].keyIndex = i+1;
                }
                resolve(res.data);
            }
        })
        .catch(function(err){
            reject(new Error(err));
        });
    });
}