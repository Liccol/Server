let mysql = require('mysql');
let keySyncRes = {
    "type":" keySyncRequest ",
    "version":"1.0",
    "kmsID":"base64_string",
    "nonce":"223",
    "selectedAlgorithm":"string",
    "contentInfos":[
        {
            "contentID":"1225",
            "ceks":[
                {
                    "cekID":"2",
                    "encCEK":"23456789",
                    "startTime":"1",
                    "endTime":"100"
                }],
            "contentRules":"2"
        },
    ],
    "certificateChain":["base64_string","base64_string",],
    "signature":"base64_string"
};
let addContent = {
    "contentID": keySyncRes.contentInfos[0].contentID,
    "sessionKeyID": "",
    "encSessionKey": "",
    "cekID": keySyncRes.contentInfos[0].ceks[0].cekID,
    "encCEK": keySyncRes.contentInfos[0].ceks[0].encCEK,
    "contentRules": keySyncRes.contentInfos[0].contentRules,
    // "update_date": Date.now().toString(),
    "duration": 1
};
let keySyncRsp = {
    "type":" keyResponse ",
    "version":"1.0",
    "keyGateWayID":"222",
    "nonce":"base64_string",
    "status":"string",
    "selectedAlgorithm":"string",
    "cekInfos":[
        {
            "contentID":"base64_string",
            "sessionKeyID":"base64_string",
            "encSessionKey":"base64_string",
            "encCEKs":[
                {
                    "cekID":"base64_string",
                    "encCEK":"base64_string"
                }],
    "contentRules":"base64_string"
    }],
    "certificateChain":["base64_string","base64_string"],
    "signature":"base64_string"
};

let resultStr = '';
// 建立mysql连接
let pool = mysql.createPool({
	connectionLimit: 100,
    host     : '172.17.0.1',
    user     : 'lichenhan',
    password : '123456',
    database : 'drm'
});
// 查找
function select(contentID, dstColumn, tableName) {
    pool.getConnection(function(err, connection) {
        if (err) throw err; // not connected!
        let sql = 'SELECT ' + dstColumn + ' FROM ' + tableName + ' WHERE contentID = \'' + contentID + '\'';
        // Use the connection
        connection.query(sql, function (error, results, fields) {
            keySyncRsp.sessionKeyID = results[0].sessionKeyID;
            keySyncRsp.encSessionKey = results[0].encSessionKey;
            keySyncRsp.cekInfos[0].encCEKs[0].cekID = results[0].cekID;
            keySyncRsp.cekInfos[0].encCEKs[0].encCEK = results[0].encCEK;
            keySyncRsp.contentRules = results[0].contentRules;
            // When done with the connection, release it.
            connection.release();
            // Handle error after the release.
            if (error) throw error;
            // Don't use the connection here, it has been returned to the pool.
        });
    });
    return JSON.stringify(keySyncRsp);

}
//添加
function add(content) {
    pool.getConnection(function(err, connection) {
        if (err) throw err; // not connected!
        let query = connection.query("INSERT INTO drm_tb SET ?", JSON.parse(content), function (error, results, fields) {
            console.log(query.sql); //INSERT INTO posts 'id'=1, 'title'='Hello MySQL'// When done with the connection, release it.
            // When done with the connection, release it.
            connection.release();
            // Handle error after the release.
            if (error) throw error;
            // Don't use the connection here, it has been returned to the pool.
        });
    });
}
//修改
function update() {
    pool.getConnection(function(err, connection) {
        if (err) throw err; // not connected!

        let query = connection.query('UPDATE drm SET name=?where id?', ['update', 1], function (error, results, fields) {
            console.log(query.sql);
            console.log('changed:' + results.changeRows + 'rows');
            // When done with the connection, release it.
            connection.release();
            // Handle error after the release.
            if (error) throw error;
            // Don't use the connection here, it has been returned to the pool.
        });
    });
}
//删除
function deletes() {
    pool.getConnection(function(err, connection) {
        if (err) throw err; // not connected!
        let query = connection.query("INSERT INTO drm_tb SET ?", JSON.parse(content), function (error, results, fields) {
            console.log(query.sql);
            console.log('deleted:' + results.affectedRows + 'rows');
            // When done with the connection, release it.
            connection.release();
            // Handle error after the release.
            if (error) throw error;
            // Don't use the connection here, it has been returned to the pool.
        });
    });
}

// add(JSON.stringify(addContent))
exports.select = select;
exports.add = add;
exports.update = update;
exports.deletes = deletes;