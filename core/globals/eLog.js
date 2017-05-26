let chalk = require('chalk');
global.eLog = (msg,priority,type,obj) => {
    let logLevel;
    try{
        // console.log(CORE.Config);
        logLevel = CORE.Config.logLevel;
    } catch (err) {
        logLevel = 0;
    }

    type = type || 'grey';
    priority = priority || 0;
    if(priority <= logLevel) {
        if(chalk[type]){
            console.log(chalk[type](msg));
            // console.log(priority,logLevel);
            if(obj && (priority+CORE.Config.oLogThresh) <= logLevel){
                console.log(obj);
                console.log(chalk[type](msg + ' ^^^^^^^^^^'));
            }
        } else {
            console.log(msg,obj);
        }
    }
};

