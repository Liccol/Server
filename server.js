let contentAuth = require("./contentAuth");
let keyGateWay = require("./keyGateWay");
let express = require('express');
const bodyParser = require('body-parser');
let app = express();
// log module
let log4js = require('log4js');
log4js.configure({
    appenders: 
    {
      console: { type: 'console' },
      file: { type: 'file', filename: './logs/auth.log' }
    },
    categories:{
      auth: { appenders: ['file'], level: 'info' },
      default: { appenders: ['console'], level: 'info' }
    },
    replaceConsole: true
   });
let logger = log4js.getLogger('auth');


app.use(log4js.connectLogger(logger, { level: log4js.levels.INFO, format: (req, res, format) => format(`:remote-addr - :method :url - :status`)}));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	console.log('get / GET request');
    res.send('Hello user!\n');
    console.log(req.ip);
})
app.get('/welcome', (req, res, next) => {
	console.log('get /welcome GET request');
    res.send ({
        error: 0,
        msg: 'welcome!'
    })
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
// 许可证请求响应接口, 返回许可证请求响应内容
app.post('/licenseReq', (req, res, next) =>{
	console.log('get /licenseReq POST request');
    console.log('get license request: ',req.body);
    licenseRsp = contentAuth.reqAnalyze(JSON.stringify(req.body));
    res.send(licenseRsp);
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

app.listen(8082);
console.log('Listening on container port 8082.');
