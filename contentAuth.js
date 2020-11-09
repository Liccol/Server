var http = require('http');
var querystring =require('querystring');
var licenseRsp = {
    "type":"licenseResponse",
    "status":"string",
    "version":"2.0",
    "selectedAlgorithm":"KMSProfile1",
    "responseTime":"string",
    "deviceID":"base64_string",
    "drmServerID":"base64_string",
    "nonce":"base64_string",
    "protectedLicenses" :[""],
    "certificateChain":[""],
    "ocspResponse":"base64_string",
    "signature":"base64_string"
};

function reqAnalyze(licenseReq) {
    console.log(licenseReq);
    var reqJson = JSON.parse(licenseReq);
    // console.log(reqJson.deviceID);
    // 添加密钥查询函数, 向查询端口发送内容
    // 获取查询内容
    keyInqReq(licenseReq);
    return JSON.stringify(licenseRsp);
}
// 密钥查询, 从密钥网关中获取需求的许可证部分内容
function keyInqReq(licenseReq) {
    //var content = querystring.stringify(licenseReq);
    var options = {
        host: '127.0.0.1',
        port: 8080,
        path: '/keyInquire',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Content-Length': licenseReq.length
        }
    }
    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function(data){
            console.log("data: ",data);
        })
    })
    req.write(licenseReq);
    req.end;
}

exports.reqAnalyze = reqAnalyze;