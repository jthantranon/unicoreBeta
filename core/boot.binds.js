console.log('=== DB URL: ===: ' + CORE.Config.dbURL);
const db = require('monk')(CORE.Config.dbURL);
let fs = require('fs');

function getDirFiles(xPath){
    return fs.readdirSync(__dirname + '/' + xPath || '');
}

function filterFileArrayForPrefix(fileArray,prefix,params){
    let newFileArray = [];
    fileArray.forEach(file => {
        let splitFile = file.split('.');
        if(splitFile[0] === prefix){
            const requestFile = file.split(prefix + '.')[1];
            if(requestFile){
                if(params.nameOnly){
                    newFileArray.push(splitFile[1]);
                } else if(params.fullFileName){
                    newFileArray.push(file);
                } else {
                    newFileArray.push(file);
                }
            }
        }

    });
    return newFileArray;
}

module.exports = {
    models: () => {
        let models = {};
        let schemas = {};
        getDirFiles('pods').forEach(pod => {
            let fileArray = getDirFiles('pods/' + pod);
            let modelsArray = filterFileArrayForPrefix(fileArray,'model',{
                nameOnly: true
            });
            function loadModel(name){
                eLog(`Loading Model: ${name}`);
                models[name] = db.get(name.toLowerCase());
            }
            modelsArray.forEach((model)=>{
                loadModel(model);
                eLog(`Loading Command: ${model}`);
                let fullPath = __dirname + '\\pods\\' + pod + '\\model.' + model + '.js';
                schemas[model] = require(fullPath);
            });
        });

        return {
            models: models,
            schemas: schemas
        };
    },
    commands: () => {
        let commands = {},
            cmdAlias = {
                go: ['goLoc','goUp','goDown','spawn','exitStack','goBack']
            };
        getDirFiles('pods').forEach(pod => {
            let fileArray = getDirFiles('pods/' + pod);
            let modelsArray = filterFileArrayForPrefix(fileArray,'cmd',{
                nameOnly: true
            });
            // function loadModel(name){
            //     eLog(`Loading Command: ${name}`);
            //     // commands[name] = require(fullPath);
            // }
            modelsArray.forEach((command)=>{
                eLog(`Loading Command: ${command}`);
                let fullPath = __dirname + '\\pods\\' + pod + '\\cmd.' + command + '.js';
                // console.log();
                let file = require(fullPath);
                commands[command] = file.cmd;
                // console.log(command,file.meta);
                // console.log(!!file.meta.roles[0]);
                if(!!file.meta.roles[0]){ // If roles
                    file.meta.roles.forEach(r => {
                        CORE.CMD_LIST[r] = CORE.CMD_LIST[r] || [];
                        CORE.CMD_LIST[r].push(command)
                    })
                }
                if(!!file.meta.params){ // If roles
                    CORE.CMD_PARAMS[command] = file.meta.params;
                    // file.meta.params.required.forEach(r => {
                    //     CORE.CMD_PARAMS[command] = CORE.CMD_LIST[r] || [];
                    //     CORE.CMD_LIST[r].push(command)
                    // })
                    // file.meta.params.optional.forEach(o => {
                    //     CORE.CMD_LIST[r] = CORE.CMD_LIST[r] || [];
                    //     CORE.CMD_LIST[r].push(command)
                    // })
                }
                CORE.CMD_LIST.ALL.push(command);
                // loadModel(model);
                if(cmdAlias[command]){
                    cmdAlias[command].forEach(alias => {
                        commands[alias] = commands[command];
                    });
                }
            });

        });
        console.log(CORE.CMD_LIST);
        console.log(CORE.CMD_PARAMS);
        return commands;
    },
    sockOns: (socket) => {
        let sockOns = {};
        getDirFiles('pods').forEach(pod => {
            let fileArray = getDirFiles('pods/' + pod);
            let modelsArray = filterFileArrayForPrefix(fileArray,'sockOn',{
                nameOnly: true
            });
            // function loadModel(name){
            //     eLog(`Loading Command: ${name}`);
            //     // commands[name] = require(fullPath);
            // }
            modelsArray.forEach((command)=>{
                eLog(`Loading Command: ${command}`);
                let fullPath = __dirname + '\\pods\\' + pod + '\\sockOn.' + command + '.js';
                // console.log();
                sockOns[command] = require(fullPath)(socket);
                // loadModel(model);
            });
        });
        // console.log(sockOns);
        return sockOns;
    }
};