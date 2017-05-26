module.exports = {
    cmd: createStack,
    meta: {
        roles: [
            'admin'
        ]
    }
};
// const Tools = require('./util.tools').getInstance(),
//     Grids = Tools.Grids,
//     Stencils = Tools.Stencils,
//     getFullStack = Tools.getFullStack,
//     newID = Tools.newID,
//     gridifyStencil = Tools.gridifyStencil,
//     edenator = Tools.edenator;

function createStack(params,cb){
    console.log('creating Stack ===');
    // TODO: Params needed - meta.sprite, name, stencil, size, id

    console.log(CORE.Schemas);

    // function createGrid(params,cb){
    //     const sprite = params.meta.sprite,
    //         id = newID(),
    //         input = {
    //             id: id,
    //             name: params.name || sprite.handle + "'s Unamed Stack (" + id + ")",
    //             size: 3,
    //             naturalExit: sprite.location,
    //             stencil: gridifyStencil(Stencils.apartmentx3),
    //         };
    //     edenator('grid',input).then((grid)=>{
    //         params.portalGridID = grid.id;
    //         createNaturalPortal(params,cb);
    //         if(params.confirmCB) params.confirmCB(true);
    //     });
    // }
    //
    // function createNaturalPortal(params,cb){
    //     console.log('=== CNP'); //,params);
    //     const grid = params.meta.grid,
    //         openXY = params.openXY;
    //     grid.naturalPortals = grid.naturalPortals || {};
    //     grid.naturalPortals[openXY.x] = grid.naturalPortals[openXY.x] || {};
    //     grid.naturalPortals[openXY.x][openXY.y] = '0.' + params.portalGridID;
    //
    //     Grids.findOneAndUpdate(
    //         { _id: grid._id },
    //         { $set: { naturalPortals: grid.naturalPortals } }
    //     ).then(()=>{
    //         cb({
    //             then: 'getStack',
    //             params: params
    //         });
    //     });
    //
    // }
}
/**
 * Created by jftac on 10/31/2016.
 */

createStack();