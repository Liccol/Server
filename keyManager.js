var http = require('http');
var querystring =require('querystring');

// TODO: 添加验证内容
// TODO: 同步传入的是整个req么? 还是只是某个ID? 或者在函数中解析内容?
function keySync(syncReq) {
    var content = querystring.stringify(syncReq);
    var options = {
        host: 'localhost:8080',
        path: '/keySync',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': content.length
        }
    };
    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        // 接收response, 获取其中内容
        res.on('data', function(data){
            console.log("data: ",data);
            // 添加data JSON内容的解析, 存到同步内容中去
        })
    });
    req.write(content);
    req.end;
}

exports.keySync = keySync;