/**
 * Created by jftac on 3/16/2017.
 */
module.exports = {
    required: {
        email: '',
        passHash: ''
    },
    optional: {
        egoParams: ''
    }
};

let models = {
    account: {
        required: {
            email: '',
            passHash: ''
        },
        optional: {
            egoParams: ''
        }
    },
    sprite: {
        required: {

        },
        optional: {

        }
    },
    packets: {}
};
let someParams = {
    required: {
        email: 'test@test.com',
        passHash: 'lookmomnohash'
    }
};

function createEOS(){
    return {
        names: {
            eid: '',
            uid: '',
            trueName: '',
            initName: '',
            nickName: '',
        },
        meta: {
            lastModified: '',
            creator: '',
            owner: '',
            location: '',
        },
    }
}

function createMOM(){
    return 'no mom';
}

function createEGO(params){
    let type = params.type,
        ego = {};
    ego.eos = createEOS();
    ego.mom = createMOM();
    Object.keys(model.required).forEach(rp => {
        ego[rp] = params.required[rp];
    });
    return ego;
}

console.log(createEGO(someParams));