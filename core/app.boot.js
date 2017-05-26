let basePath = process.cwd()+`\\`;
let git = require('git-rev');
let express = require('express');
let CORE = global.CORE;
CORE.CMD_LIST = {
    ALL: []
};
CORE.CMD_PARAMS = {};

// module.exports = {};
console.log('STARTING... ' + __filename);
async.series({
    Config: function(callback) {
        let coreConfig = basePath + `core\\config.template.js`,
            customConfig = basePath + `lib\\_config.js`;
        CORE.Tools.GenJSONToCore(coreConfig,customConfig,'Config',()=>{
            callback(null,'Ready.');
        });
    },
    Package: function(callback){
        global.fs.readFile('./package.json', 'utf8', (err,data) => {
            CORE.Package = JSON.parse(data);
            callback(null, 'Ready.');
        });
    },
    Git: function(callback){
        git.short(short => {
            git.branch(branch => {
                CORE.Git = {
                    short: short,
                    branch: branch
                };
                callback(null,'Ready.');
            });
        });
    },
    Express: function(callback){
        const app = express(),
            http = require('http').Server(app),
            port = CORE.Config.expressPort;

        CORE.Express = {
            getHttp: () => http
        };

        app.use('/', express.static('public'));
        app.use('/node_modules', express.static('node_modules'));
        app.use('/views', express.static('views'));
        http.listen(port, function(){
            eLog('--------------------------------------------',null,'blue');
            eLog(`=== express.js === listening on port: ${port}`,null,'green');
            eLog('--------------------------------------------',null,'blue');
            callback(null,'Ready.');
        });

    },
    // StartSequence: function(callback){
    //     // require('./bind.Models');
    //     // CORE.Database = require('./db.main');
    //     // CORE.IO = require('socket.io')(CORE.Express.getHttp());
    //     // CORE.Sockets = require('./sockets');
    //     // require('./start');
    //     callback(null,'Ready.');
    // }
}, function(err, results) {
    CORE.Models = require('./boot.binds').models().models;
    CORE.Schemas = require('./boot.binds').models().schemas;
    CORE.CMDs = require('./boot.binds').commands();
    CORE.Database = require('./boot.database');
    CORE.IO = require('socket.io')(CORE.Express.getHttp());

    require('./boot.socket');
    require('./boot.startMessage');
    // console.log(results);
    // console.log(CORE.Config);
});
