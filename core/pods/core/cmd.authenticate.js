module.exports = {
    cmd: authenticate,
    meta: {
        roles: [
            'public'
        ]
    }
};

let Accounts = CORE.Models.Accounts;

function authenticate(token,cb){
    let buffer, keys;
    function authError(number){
        eLog(`=== ERROR, AUTHENTICATE-${number} === token: ${token}, keys: ${keys}`,1,'red');
    }
    if (token) {
        buffer = new Buffer(token, 'base64').toString();
        keys = buffer.split(':');
    } else {
        authError(1);
        return
    }

    if (keys.length !== 2) {
        authError(2);
        return
    }

    Accounts.findOne({ _id: keys[0] }).then(function (account) {
        if(!account) handleError(keys,'token ERROR 4 & 5');
        (account.session || []).some(function(session) {
            if (session.guid === keys[1]) { // IF Session Exists
                eLog(`AUTH-ACCOUNT-COMPLETE`,1,'green');
                account.cmdList ={};

                console.log(CORE.CMD_LIST);
                if(account.roles){
                    account.roles.forEach(r =>{
                        console.log('role',r);
                        if(CORE.CMD_LIST[r]){
                            account.cmdList[r] = CORE.CMD_LIST[r];
                        }
                    });
                    account.cmdList['public'] = CORE.CMD_LIST['public'];
                    account.cmdList['user'] = CORE.CMD_LIST['user'];
                    if(account.currentSprite){
                        account.cmdList['sprite'] = CORE.CMD_LIST['sprite'];
                    }
                }
                console.log(account);
                cb(account);
                return true;
            } else {
                authError(3);
            }
        });
    });

}

/**
 * Created by jftac on 10/31/2016.
 */