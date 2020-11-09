const express = require("express");
//定义路由级中间件
const router = express.Router();
var http = require('http');

function getDate(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
    return year + "-" + month + "-" + day;
}

function getDateStr(date) {
    let arr = date.split('-');
    return arr[0] + "-" + arr[1] + "-" + arr[2];
}
function postToPorts(port, path, jsonData) {
    //var content = querystring.stringify(licenseReq);
    var options = {
        host: '127.0.0.1',
        port: port,
        path: path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Content-Length': jsonData.length
        }
    };
    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function(data){
            console.log("data: ",data);
            JSON.parse(data);
        })
    });
    req.write(jsonData);
    req.end;
}

// 内容授权/许可证请求端口
router.post('/contentAuth', (req, res) =>{
    //console.log('get /licenseReq POST request: ',req.body);
    //licenseRsp = contentAuth.reqAnalyze(JSON.stringify(req.body));
    //res.send(licenseRsp);
    if(req.body.type !== "licenseRequest"
        || req.body.version !== "2.0"
        || req.body.supportedAlgorithms !== "KMSProfile1")
        res.send("API error! Please check the data.");
    else{
        let keyInquireData = {
            deviceID : req.body.deviceID,
            nonce : req.body.nonce,
            requestTime : req.body.requestTime,
            contentIDs : req.body.contentIDs,
            extensions : req.body.extensions,
            certificateChain : req.body.certificateChain,
            signature : req.body.signature
        };
        postToPorts(8082, '/keyInquire', keyInquireData);
    }
});

// 密钥查询端口
router.post('/keyInquire', (req, res) =>{
    //console.log('get /licenseReq POST request: ',req.body);
    //licenseRsp = contentAuth.reqAnalyze(JSON.stringify(req.body));
    //res.send(licenseRsp);
    if(req.body.type !== "licenseRequest"
        || req.body.version !== "2.0"
        || req.body.supportedAlgorithms !== "KMSProfile1")
        res.send("API error!");
    else{
        let deviceID = req.body.deviceID;
        let nonce = req.body.nonce;
        let requestTime = req.body.requestTime;
        let contentIDs = req.body.contentIDs;
        let extensions = req.body.extensions;
        let certificateChain = req.body.certificateChain;
        let signature = req.body.signature;
    }
});

let keySyncRes = {
    "type":"keySyncRequest",
    "version":"1.0",
    "kmsID":"c2RmYWRmYWVkYWZzZA",
    "nonce":"375",
    "selectedAlgorithm":"AES",
    "contentInfos":[
        {
            "contentID":"2",
            "ceks":[
                {
                    "cekID":"2",
                    "encCEK":"Y2hhaW4xMg",
                    "startTime":"1",
                    "endTime":"100"
                }],
            "contentRules":"2"
        },
    ],
    "certificateChain":["Chain1","Y2hhaW4xMg==",],
    "signature":"emhlamlhbmd1bml2ZXJzaXR5eGRsMjIw"
};
// GET ?动态查询参数
app.get('/keySync', (req, res, next) =>{
    console.log('get /keySync GET request');
    console.log(req.query);
    res.send(keySyncRes);
});

//TODO: POST json格式发送数据, 通过body获取内容, 密钥管理向网关发起同步请求, 在mysql中添加密钥内容
app.post('/keySync', (req, res, next) =>{
    console.log('get /keySync POST request');
    console.log(req.body.name);
    keySyncRsp = keyGateWay.add(JSON.stringify(keySyncRes));
    res.send(keySyncRsp);
});
// contentAuth 向 keyGateWay 发起密钥同步POST请求
app.post('/keyInquire', (req, res, next) =>{
    console.log('get /keyInquire POST request');
    keyInquireRsp = keyGateWay.select('test',
        'contentID, sessionKeyID, encSessionKey, cekID, encCEK, contentRules, duration',
        'drm_tb');
    res.send(keyInquireRsp);
});

router.use('/add', function (req, res) {
    let sql  ="INSERT INTO ceks_info (ContentID,Ceks,RegisterTime,StartTime,EndTime) VALUES(?,?,?,?,?);";
    let sqlParams = [
        req.body.contentID,
        req.body.ceks,
        getDate(new Date()),
        getDateStr(req.body.startTime),
        getDateStr(req.body.endTime)
    ];
    console.log(sqlParams);
    query(sql,sqlParams,function (err,result) {
        if(err){
            res.json({
                ok:false,
                message:'创建失败！'
            })
        }else{
            res.json({
                ok:true,
                id:result.insertId,
                message:'创建成功！'
            })
        }
        res.end();
    })
});
/*删除*/
router.use('/test/delete', function (req, res) {
    let delSql = 'DELETE FROM ceks_info where ContentID='+req.body.contentID;
    query(delSql,null, function(err, rows, fields) {
        if(err){
            res.json({
                ok:false,
                message:'删除失败！',
                error:err
            })
        }else{
            res.json({
                ok:true,
                message:'删除成功！'
            })
        }
        res.end();
    })
});
/* 编辑 */
router.use('/test/edit', function (req, res) {
    let editSql = 'UPDATE ceks_info SET Ceks=?,RegisterTime=?,StartTime=?,EndTime=? WHERE ContentID ='+req.body.contentID;
    let editSqlParams = [
        req.body.ceks,
        getDate(new Date()),
        getDateStr(req.body.startTime),
        getDateStr(req.body.endTime)
    ];
    console.log(editSqlParams);
    query(editSql,editSqlParams,function (err,result) {
        if(err){
            res.json({
                ok:false,
                message:'修改失败！'
            })
        }else{
            res.json({
                ok:true,
                message:'修改成功！'
            })
        }
        res.end();
    })
});
/*查询*/
router.use('/test/query', function (req, res) {
    let pageNumber = req.body.pageNumber;
    let pageSize = req.body.pageSize;
    let start = (pageNumber-1)*pageSize;
    let end = pageNumber*pageSize;
    let sql = "SELECT * FROM ceks_info ORDER BY ContentID ASC LIMIT "+start+","+end;
    let countSql = "SELECT COUNT(ContentID) FROM ceks_info";
    const promise = new Promise(function(resolve, reject) {
        query(countSql,null,function (err, rows, fields) {
            resolve(rows);
        })
    }).then((count)=>{
        query(sql,null, function(err, rows, fields) {
            if(err){
                res.json({
                    ok:false,
                    message:'查询失败！',
                    info:null
                })
            }else{
                res.json({
                    ok:true,
                    message:'查询成功！',
                    info:rows,
                    total:count[0]["COUNT(ContentID)"]
                })
            }
            res.end();
        });
    })
});
/*将路由模块输出*/
module.exports = router;
