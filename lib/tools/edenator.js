/**
 * Created by jftac on 2/15/2017.
 */
function newID(customID,type){
    if(customID){
        return customID.toString();
    } else {
        var id = chance.integer({min: 1, max: 999}).toString()
        console.log('creating new ID --- ',id,'===');
        return id;
    }
}
global.CORE.Tools.edenator = (schema,o,callback) => {
    console.log('edenator === ', schema);
    const Models = {
        stack: Stacks,
        grid: Grids
    };
    if(!schema || typeof schema !== 'string'){
        console.log('ERROR NO SCHEMA, RETURNING');
        return;
    }
    o.id = newID(o.id);
    o.guid = o.guid || global.chance.guid();
    o.name = o.name || 'Unnamed';
    o.schematic = schema;
    switch(schema){
        case 'grid':
            o.size = parseInt(o.size) || 3;
            o.naturalPortals = o.naturalPortals || {};
            // o.stackID = o.stackID && o.stackID.toString() || "0";
            break;
        case 'stack':

            break;
    }
    console.log(schema);
    return Models[schema].insert(o);
};