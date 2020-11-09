const express = require('express');
/*用于解析json格式数据*/
const bodyParser = require('body-parser');

const server = express();

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

server.use(log4js.connectLogger(logger, { level: log4js.levels.INFO, format: (req, res, format) => format(`:remote-addr - :method :url - :status`)}));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

/*引入接口路由服务*/
const router = require('./server/test');
// 将服务路由挂载至服务器
server.use('/',router);
server.get('/', (req, res) => {
    console.log('get / GET request');
    res.send('Hello user!\n');
    console.log(req.ip);
});

/*对外输出端口号*/
server.listen(8082,()=>{
    console.log('Server is running at http://localhost:8082');
});

