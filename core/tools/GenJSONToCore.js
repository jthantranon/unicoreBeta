global.CORE.Tools.CopyFile = CopyFile;
global.CORE.Tools.GenJSONToCore = GenJSONToCore;
// let fs = require('fs');

function CopyFile(source, target, cb){
    console.log(source,target);
    let cbCalled = false;
    // target = target.substr(1);

    let rd = fs.createReadStream(source);
    rd.on("error", function(err) {
        done(err);
    });
    let wr = fs.createWriteStream(target);
    wr.on("error", function(err) {
        done(err);
    });
    wr.on("close", function(ex) {
        done();
    });
    rd.pipe(wr);

    function done(err) {
        if (!cbCalled) {
            cb(err);
            cbCalled = true;
        }
    }
}

function GenJSONToCore(source,target,name,cb){
    let exists = fs.existsSync(target);
    if(exists){
        CORE[name] = require(target);
        cb();
    } else {
        CopyFile(source,target, (err) => {
            if(err) console.log(err);
            console.log('Config file created. Please set options in /lib/_config.js before restarting');
            CORE[name] = require(target);
            cb();
        });
    }
}