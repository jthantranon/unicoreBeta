module.exports = {
    cmd: go,
    meta: {
        roles: [
            'sprite'
        ]
    }
};

let Accounts = CORE.Models.Accounts,
    Sprites = CORE.Models.Sprites;

function go(params,cb){
    eLog(`=== go >>> ${params.action}... ${params.goLoc || ''}`,3,'white',params);
    const location = params.meta.sprite.location;
    let oldLoc = location.split('.');
    function vertChange(dir){
        oldLoc[1] = parseInt(oldLoc[1]) + dir;
    }

    switch(params.action){
        case 'spawn':
            oldLoc = [1,0,0,0];
            break;
        case 'exitStack':
            if(oldLoc[0] !== "0" && oldLoc[1] !== "0"){
                oldLoc[1] = 0;
            } else if(oldLoc[0] === "0") {
                oldLoc = params.meta.grid.naturalExit.split('.');
            } else {
                oldLoc = params.meta.stack.naturalExit.split('.');
            }
            break;
        case 'goUp':
            vertChange(1);
            break;
        case 'goDown':
            vertChange(-1);
            break;
        case 'goLoc':
            oldLoc = params.goLoc;
            break;
        case 'goBack':
            oldLoc = params.meta.sprite.previousLocation.split('.');
            break;
    }

    const newLocation = oldLoc.join('.');
    eLog(`   moving from ${location} to ${newLocation}`,1,'white');
    Sprites.findOneAndUpdate(
        {_id: params.current_sprite_id},
        { $set: {location: newLocation, previousLocation: location} }
    ).then((sprite)=>{
        cb({
            action: 'update',
            what: 'sprite',
            with: sprite
        });
        cb({
            then: 'getStack',
            params: params
        });
    });
}

/**
 * Created by jftac on 10/31/2016.
 */