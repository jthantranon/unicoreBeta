module.exports = {
    cmd: createEON,
    meta: {
        roles: [
            'admin'
        ],
        params: {
            required: [],
            optional: [
                'id',
                'guid',
                'name',
            ]
        }
    }
};

function createEON(p,cb){
    let newEON = {};
    let validParams = {
        required: [],
        optional: []
    };

    console.log('creating EON ===');
    let o = p.o || {};
    newEON.id = newID(o.id);
    newEON.guid = newGUID(o.guid);
    newEON.name = newName(o.name);

    function newID(customID,type){
        if(customID){
            return customID.toString();
        } else {
            let id = chance.integer({min: 1, max: 999}).toString();
            console.log('creating new ID --- ',id,'===');
            return id;
        }
    }

    function newGUID(customGUID){
        return customGUID || chance.guid();
    }

    function newName(customName){
        return customName || 'EON-' + newEON.guid.split('-')[4];
    }

    console.log(newEON);
    return newEON;
}
/**
 * Created by jftac on 10/31/2016.
 */