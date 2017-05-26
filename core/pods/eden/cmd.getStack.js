module.exports = {
    cmd: getStack,
    meta: {
        roles: [
            'user'
        ]
    }
};

let Accounts = CORE.Models.Accounts,
    Sprites = CORE.Models.Sprites;

function getStack(params,cb){
    eLog(`---> getting stack...`,1,'grey',params);
    const stack = params.meta.stack,
        grid = params.meta.grid;

    if(!grid){
        console.log('====== !!! NO GRID, GOING BACK !!! =======');
        cb({
            then: 'goBack',
            params: params
        });
        return;
    }

    // const gridOff = getGridOff(grid.size);
    // grid['gridOff'] = gridOff;
    // const renderedGrid = renderGrid(grid);

    cb({
        action: 'update',
        what: 'renderedGrid',
        // with: renderedGrid,
        // offset: gridOff
    });
    cb({
        action: 'update',
        what: 'stack',
        with: stack
    });
    cb({
        action: 'update',
        what: 'grid',
        with: grid
    });

    // codeWordComplete(params.codeWord);

    return {
        renderedGrid: renderedGrid,
        grid: grid,
        gridOff: gridOff
    }
}

/**
 * Created by jftac on 10/31/2016.
 */