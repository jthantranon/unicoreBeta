/**
 * Created by jftac on 1/7/2017.
 */
// const Tools = require('./util.tools').getInstance(),
//     codeWordComplete = Tools.codeWordComplete,
//     chance = Tools.chance;
// let chance = new require('chance')();
const Chance = require('chance'),
    chance = new Chance();
let DB = CORE.Database;

module.exports = (socket) => {
    return ($req) => {
        console.log($req);
        const dt = new Date();
        const codeWord = `${chance.state({full:true})} ${chance.street_suffix().name} - ${dt.toLocaleTimeString()}`;
        eLog(``,0,'white');
        eLog(`================================================= \\/ ${codeWord.toUpperCase()} \\/ =================================================`,0,'white');
        eLog(`>>> SOCKET.IO.ON.CONNECTION.DB --- ${$req.type.toUpperCase()} [${$req.action}] [${codeWord.toUpperCase()}] >>>`,0,'blue',$req);
        eLog(`-------------------------------------------------------------------------------------------------`,0,'grey');

        let params = $req.params;
        $req.params = params || {};
        $req.params.codeWord = codeWord;

        function cb(data){
            if(data.then){
                data.type = 'request';
                params = data.params;
                params.action = data.then;
                eLog(`   then >>> ${data.then}`,0,'green');
                DB.requestRouter(params,cb);
            } else {
                eLog(`   +++ Display Updated For: ${data.what}`,1,'green',data.reloadWithDebugInfo);
                socket.emit('Display',data);
            }
        }

        switch($req.type){
            case 'register':
                DB.CMD.register({
                    username: $req.username || null,
                    password: $req.password || null,
                    email: $req.email || null,
                    id: $req.id || null,
                    codeWord: codeWord
                },socket);
                break;
            case 'login':
                DB.CMD.login({
                    username: $req.username,
                    password: $req.password
                }, socket, auth => {
                    socket.emit('Auth',auth);
                    // codeWordComplete(codeWord);
                },cb);
                break;
            case 'request':
                DB.CMD.authenticate($req.token,(account)=>{
                    $req.params.action = $req.action;
                    socket.emit('AuthResult',!!account); // TODO: don't return whole account
                    if(account){
                        $req.params.account_id = account._id;
                        $req.params.current_sprite_id = account.currentSprite;
                        $req.params.meta = $req.params.meta || {};
                        $req.params.meta.account = account;
                        eLog(`   === AUTH OK === DO [${$req.action}] ${typeof DB.CMD[$req.action] === 'function'}`,1,typeof DB.CMD[$req.action] === 'function' ? 'green' : 'red');
                        DB.requestRouter($req.params,cb);
                    }
                });
                break;
        }
    }
};