module.exports = {
    cmd: listSprites,
    meta: {
        roles: [
            'user'
        ],
        params: {
            required: ['account_id'],
            optional: []
        }
    }
};

let Sprites = CORE.Models.Sprites;

function listSprites(params,cb){
    eLog(`=== Listing Sprites for ${params.meta.account.username} ===`,1,'yellow',params);
    Sprites.find({'owner': params.account_id}).then((sprites)=>{
        if(sprites){
            cb({
                action: 'update',
                what: 'sprites',
                with: sprites
            });
        }
        // codeWordComplete(params.codeWord);
    })
}

/**
 * Created by jftac on 10/31/2016.
 */