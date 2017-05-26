module.exports = {
    cmd: createEON,
    meta: {
        roles: [
            'admin'
        ],
        params: {
            required: ['schema'],
            optional: [
                'id',
                'guid',
                'name',
            ]
        }
    }
};

function createEON(p,cb){
    let validParams = {
        required: [],
        optional: []
    };

    console.log('creating EON ===');
    let schema = p.req.schema,
        o = p.o || {};
    if(!schema || typeof schema !== 'string'){
        console.log('ERROR NO SCHEMA, RETURNING');
        return;
    }

    let schemaCased = schema.charAt(0).toUpperCase() + schema.slice(1);

    o.id = newID(o.id);
    o.guid = o.guid || chance.guid();
    o.name = o.name || 'Unnamed (' + schemaCased + ')';


    o.schematic = schemaCased;
    // switch(schema){
    //     case 'grid':
    //         o.size = parseInt(o.size) || 3;
    //         o.naturalPortals = o.naturalPortals || {};
    //         break;
    //     case 'stack':
    //         break;
    // }
    // console.log(schema);
    // console.log('before merge',o);
    // return;
    if(!CORE.Schemas[schemaCased]) {
        eLog(`SCHEMA '${schemaCased}' NOT FOUND. Returning`,1,'red');
        return;
    }
    console.log(CORE.Schemas);
    let schemaModel = CORE.Schemas[schemaCased](o);
    Object.keys(schemaModel).forEach(k=>{
        o[k] = o[k] || schemaModel[k];
    });
    console.log('model',schemaModel);
    console.log('all',o);
    return;
    // return o;

    function newID(customID,type){
        if(customID){
            return customID.toString();
        } else {
            let id = chance.integer({min: 1, max: 999}).toString();
            console.log('creating new ID --- ',id,'===');
            return id;
        }
    }

    CORE.Models[schemaCased].insert(o).then(eon => {
        eLog(`=== ${schemaCased} Created ===`,1,'green',eon);
        console.log(eon);
    }).catch((err) => {
        console.log(err);
    });
    // return;
    // let schema = params.schema,
    //     o = params.o || {};
    // if(!schema || typeof schema !== 'string'){
    //     console.log('ERROR NO SCHEMA, RETURNING');
    //     return;
    // }
    //
    // let schemaCased = schema.charAt(0).toUpperCase() + schema.slice(1);
    //
    // o.id = newID(o.id);
    // o.guid = o.guid || chance.guid();
    // o.name = o.name || 'Unnamed (' + schemaCased + ')';
    // o.schematic = schemaCased;
    // // switch(schema){
    // //     case 'grid':
    // //         o.size = parseInt(o.size) || 3;
    // //         o.naturalPortals = o.naturalPortals || {};
    // //         break;
    // //     case 'stack':
    // //         break;
    // // }
    // console.log(schema);
    // console.log('before merge',o);
    // let schemaModel = CORE.Schemas[schemaCased](o);
    // Object.keys(schemaModel).forEach(k=>{
    //    o[k] = schemaModel[k];
    // });
    // console.log('model',schemaModel);
    // console.log('all',o);
    // // return o;
    //
    // function newID(customID,type){
    //     if(customID){
    //         return customID.toString();
    //     } else {
    //         let id = chance.integer({min: 1, max: 999}).toString();
    //         console.log('creating new ID --- ',id,'===');
    //         return id;
    //     }
    // }
    //
    // CORE.Models[schemaCased].insert(o).then(eon => {
    //     eLog(`=== ${schemaCased} Created ===`,1,'green',eon);
    //     console.log(eon);
    // }).catch((err) => {
    //     console.log(err);
    // });
};
/**
 * Created by jftac on 10/31/2016.
 */