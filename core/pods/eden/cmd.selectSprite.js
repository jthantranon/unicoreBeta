module.exports = {
    cmd: selectSprite,
    meta: {
        roles: [
            'user'
        ],
        params: {
            required: ['spriteID'],
            optional: []
        }
    }
};

let Accounts = CORE.Models.Accounts,
    Sprites = CORE.Models.Sprites;

function selectSprite(params,cb){
    eLog(' === SELECT SPRITE ===',1,'white',params);
    params.spriteID = params.spriteID || params.current_sprite_id;
    Sprites.findOne({_id: params.spriteID}).then((sprite)=>{
        console.log('THISSSSSS*********',sprite.owner);
        Accounts.findOneAndUpdate(
            { _id: sprite.owner }, //params.account_id }, // TODO: Pull account ID from sprite owner
            { $set: { currentSprite: params.spriteID } }
        ).then(function (account) {
            if(account){
                eLog('--- Account: CurrentSprite Updated ---',3,'white');
                renderInventory(sprite).then((sprite)=>{
                    eLog(`         ... inventory render complete, sprite updated. <---`,3,'white');
                    params.current_sprite_id = sprite._id;
                    params.meta.sprite = sprite;
                    cb({
                        action: 'update',
                        what: 'sprite',
                        with: sprite
                    });
                    // cb({
                    //     then: 'getStack',
                    //     params: params
                    // });
                    params.schema = 'stacks';
                    params.o = {
                        name: 'Wee',
                        id: 42
                    };
                    cb({
                        then: 'createEON',
                        params: params
                    });
                });
            } else {
                console.log('no data?');
            }
        });
    })
}

function createBlankGrid(size){
    let grid = {};
    for(let r = 0; r < size; r++){
        grid[r] = grid[r] || {};
        for(let c = 0; c < size; c++){
            grid[r][c] = 'x';
        }
    }
    return grid;
}

function renderInventory(sprite){
    eLog(`---> Rendering ${sprite.handle}'s inventory... `,3,'grey');
    let rInventory = createBlankGrid(sprite.inventory.size);
    for(let r in rInventory){
        if(rInventory.hasOwnProperty(r)){
            for(var c in rInventory[r]){
                if(rInventory[r].hasOwnProperty(c)){
                    try{
                        if(sprite.inventory.grid[r][c]) rInventory[r][c] = sprite.inventory.grid[r][c];
                    } catch(err){
                        // TODO: handle this;
                    }
                }
            }
        }
    }
    return Sprites.findOneAndUpdate(
        {_id: sprite._id},
        {$set: {rInventory: rInventory}}
    )

}

/**
 * Created by jftac on 10/31/2016.
 */