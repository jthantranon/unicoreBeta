module.exports = {
    cmd: login,
    meta: {
        roles: [
            'public'
        ]
    }
};

let Accounts = CORE.Models.Accounts;
// let chance = new require('chance');
// const Tools = require('./util.tools').getInstance(),
//     socketError = Tools.socketError,
//     Accounts = Tools.Accounts,
//     chance = Tools.chance;

// const Chance = require('chance'),
//     chance = new Chance();

const Chance = require('chance'),
    chance = new Chance();


const bcrypt = require('bcrypt-nodejs');//,
    // async = require('async');

function login(client,socket,acb,cb){
    eLog(`=== Login Requested. Retrieving Requested Account...`,1,'green');
    async.waterfall([
        getAccount,
        authenticate,
        getSession
    ], function (err, result) {
        socketError(socket,{
            err: 'Auth failed, try again.',
            code: '605'
        });
        eLog(`!!! Login Error !!! e: ${err}`,0,'red',result || '');
    });

    function getAccount(next){
        Accounts.findOne({ username: client.username }).then(function (server) {
            if(server){
                eLog(`=== Account Retrieved. Comparing Provided Password w/ DB Hash...`,1,'yellow',server);
                let buffer = new Buffer(client.password, 'base64').toString();
                client.password = buffer;
                next(null,client.password,server.pass);
            } else {
                console.log('no data?');
                CORE.Models.Accounts.findOne({ email: client.username }).then(function (server) {
                    if(server){
                        eLog(`=== Account Retrieved. Comparing Provided Password w/ DB Hash...`,1,'yellow',server);
                        client.username = server.username;
                        next(null,client.password,server.pass);
                    } else {
                        console.log('still no data?');
                    }
                });
            }
        });
    }

    function authenticate(cPass,sPass,next){
        bcrypt.compare(cPass,sPass,(err,authenticated)=>{
            if(authenticated) {
                eLog(`=== Auth Successful. Activating Session...`,1,'white',authenticated);
                next(null);
            } else {
                next('--- PASSWORD bcrypt.compare Failed ---',err);
            }

        })
    }

    function getSession(){
        const params = {
            guid: chance.guid(),
            createdDate: new Date(),
            lastActiveDate: new Date()
        };
        CORE.Models.Accounts.findOneAndUpdate({ username: client.username },
            {
                $push: {
                    session: {
                        $each: [
                            params
                        ],
                        $sort: { lastActiveDate: -1 },
                        $slice: 3
                    },
                }
            }
        ).then(function (acct) {
            if(acct){
                eLog(`=== Session Activated. Sending Auth to Client. Welcome ${acct.username}! ===`,1,'white',acct);
                // const listSprites = require('./db.account.listSprites');
                // listSprites({
                //     account_id: acct._id,
                //     meta: {
                //         account: {
                //             username: acct.username
                //         }
                //     }
                // });
                acb({
                    _id: acct._id,
                    sesh: acct.session[0].guid,
                    username: acct.username,
                    uid: acct.uid,
                    email: acct.email
                });
                cb({
                    then: 'listSprites',
                    params: {
                        account_id: acct._id,
                        meta: {
                            account: {
                                username: acct.username
                            }
                        }
                    }
                });
            } else {
                console.log('no data?');
            }
        });
    }
}

/**
 * Created by jftac on 10/31/2016.
 */