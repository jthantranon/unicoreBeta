module.exports = {
    cmd: adminAction,
    meta: {
        roles: [
            'admin'
        ]
    }
};
// global.CORE = {};
// require('../../app.globals');

function adminAction(params,cb,meta){
    // console.log(eLog);
    eLog(`=== adminAction ===`,1,'yellow');
    let isAdmin = false;
    try{
        isAdmin = params.meta.account.isAdmin;
    } catch(err){
        isAdmin = false
    }

    if(isAdmin){
        eLog(`=== ADMIN ROLE VERIFIED. ACCESS GRANTED ===`,1,'green',params);
    } else {
        eLog(`=== ACCESS DENIED ===`,1,'red',params);
    }


    if(meta){
        let path = require('path'),
            name = path.basename(__filename),
            command = name.split('.')[1];
        return {
            role: 'admin',
            command: command
        }
    }
    // console.log('params',params);
    // console.log(params.meta.account);
    // console.log(params.meta.account.isAdmin);
}

console.log(adminAction(null,null,true));

/**
 * Created by jftac on 10/31/2016.
 */