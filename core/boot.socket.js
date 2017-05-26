console.log('STARTING... ' + __filename);
CORE.IO.on('connection',connection);
// ;
function connection(socket){
    eLog('... io.on.connection - connection made',2,'grey');
    const on = {};
    let CMD = require('./boot.binds').sockOns(socket);
    Object.keys(CMD).forEach(c=>{
        socket.on(c,CMD[c]);
    });
    socket.emit('Connected');
}
/**
 * Created by john.thantranon on 3/18/2016.
 */