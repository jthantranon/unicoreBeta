const bcrypt = require('bcrypt-nodejs'); //,
// let Config = CORE.Config;
// const db = require('monk')(Config.dbURL);

// console.log('=== DB URL: ===: ' + Config.dbURL);
// CORE.Monk = {};
// CORE.Monk.Accounts = db.get('accounts');
// let Stacks = Models.stack;
let CMD = CORE.CMDs;
module.exports = {
    // Accounts: Accounts,
    requestRouter: (params,cb) => {
        if(CMD[params.action]){
            eLog(`==================================================`,0,'blue');
            eLog(`>>> ${params.meta.sprite && params.meta.sprite.handle.toUpperCase() || params.meta.account.username ||''} --> ${params.action} ...`,0,'yellow');
            eLog(`==================================================`,0,'blue');
            CMD[params.action](params,cb);
        } else {
            console.log('!!!=== COMMAND NOT FOUND ===!!!',params.action);
        }
        // updateMeta(params,(params)=>{
        //     if(CMD[params.action]){
        //         eLog(`==================================================`,0,'blue');
        //         eLog(`>>> ${params.meta.sprite && params.meta.sprite.handle.toUpperCase() || params.meta.account.username ||''} --> ${params.action} ...`,0,'yellow');
        //         eLog(`==================================================`,0,'blue');
        //         CMD[params.action](params,cb);
        //     } else {
        //         console.log('!!!=== COMMAND NOT FOUND ===!!!',params.action);
        //     }
        // });
    },
    requestRouter2: (req,cb) => {
        let params = req.params;
        if(CMD[req.action]){
            eLog(`=2=================================================`,0,'blue');
            eLog(`>>> ${params.meta.sprite && params.meta.sprite.handle.toUpperCase() || params.meta.account.username ||''} --> ${req.action} ...`,0,'yellow');
            eLog(`==================================================`,0,'blue');
            CMD[req.action](req.reqParams,cb);
        } else {
            console.log('!!!=== COMMAND NOT FOUND ===!!!',params.action);
        }
        // updateMeta(params,(params)=>{
        //     if(CMD[params.action]){
        //         eLog(`==================================================`,0,'blue');
        //         eLog(`>>> ${params.meta.sprite && params.meta.sprite.handle.toUpperCase() || params.meta.account.username ||''} --> ${params.action} ...`,0,'yellow');
        //         eLog(`==================================================`,0,'blue');
        //         CMD[params.action](params,cb);
        //     } else {
        //         console.log('!!!=== COMMAND NOT FOUND ===!!!',params.action);
        //     }
        // });
    },
    // authenticate: authenticate,
    CMD: CMD
};

function fetchLocation(location,callback){
    const loca = location.split('.');
    Stacks.findOne({id: loca[0]}).then((stack)=>{
        eLog(`=== fetchGridStack`,4,'yellow',stack);
        const gridID = stack && stack.grids ?  stack.grids[loca[1]] : loca[1];
        eLog(`  ---> ${loca} is GridID: ${gridID}`,2,'yellow');
        returnGrid(gridID,stack);
    });
    function returnGrid(gridID,stack){
        gridID = gridID && gridID.toString();
        if(gridID){
            getGridByID(gridID).then((grid)=>{
                if(grid){
                    callback(stack,grid);
                } else {
                    callback(null,null);
                }
            });
        } else {
            callback(null,null);
        }
    }
}

function updateMeta(params,callback){
    eLog(`  ... updating meta ...`,2,'blue');
    eLog(params.action,3,'yellow');
    eLog('params',3,'yellow',params);

    function metaComplete(sprite,stack,grid){
        params.meta.sprite = sprite || null;
        params.meta.stack = stack || null;
        params.meta.grid = grid || null;
        callback(params);
    }

    console.log(params);

    if(params.current_sprite_id){
        eLog('Getting sprite...',3,'grey');
        CORE.Models.Sprites.findOne({_id: params.current_sprite_id}).then((sprite)=>{
            eLog(' ...sprite found.',1,'white',sprite);
            const location = sprite && sprite.location;
            if(sprite && location) {
                eLog('Getting grid...',3,'grey');
                fetchLocation(sprite.location,(stack,grid) => {
                    eLog(' ...grid found.',3,'white');
                    metaComplete(sprite,stack,grid);
                });
            } else {
                eLog('No Sprite.Location');
                metaComplete(sprite);
            }

        }); // TODO: add .err for bad spriteID;
    } else {
        console.log('No Current Sprite Selected.');
        callback(params);
    }
}


// function loadCMD(){
//     let activeApps = CORE.Config.activeApps;
//     // console.log();
//     const cmd = {},
//         basePath = __dirname + '/',
//         requests = fs.readdirSync(basePath);
//     // aMap = CmdAlias;
//     console.time('COMMAND LOAD TIME: ');
//     eLog('=======================================================================================>>>',null,'blue');
//     eLog('>>> LOADING DB COMMANDS... ',null,'green');
//     eLog('=======================================================================================>>>',null,'blue');
//     requests.forEach(file => {
//         if(file.split('.')[0] === 'db'){
//             const requestFile = file.split('db.')[1];
//             if(requestFile){
//                 const fullPath = basePath + file,
//                     sansJS = requestFile.split('.js')[0].split('.'),
//                     appName = sansJS[0],
//                     command = sansJS[1];
//                 if(appName === 'core' || activeApps.indexOf(appName) > -1){
//                     // console.log('eh1111');
//                     let req = require(fullPath);
//                     eLog(sansJS,1,'white');
//                     eLog(`${fullPath} >>> ${command}`,2,'gray');
//                     cmd[command] = req;
//                 }
//
//                 // if(aMap[command]){
//                 //     aMap[command].forEach(alias => {
//                 //         cmd[alias] = req;
//                 //     });
//                 // }
//             }
//         }
//
//     });
//     console.timeEnd('COMMAND LOAD TIME: ');
//     eLog('<<<=======================================================================================',null,'blue');
//     eLog('... DB COMMANDS LOADED <<<',null,'green');
//     eLog('<<<=======================================================================================',null,'blue');
//     return cmd;
// }



/**
 * Created by john.thantranon on 3/18/2016.
 */
