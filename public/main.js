 /* Created by john.thantranon on 2/23/2016.
 */
 var socket = io();
 var app = angular.module("theApp", []).controller("theController", ["$scope","$http", "$log", function($scope, $http, $log){
    $scope.colWidth = 9; //default 10
    $scope.displays = {};
    $scope.ui = {};
    $scope.reqParams = {};

    $scope.log = function(msg){
         console.log(msg);
     };

    $scope.Actions = { // false if no params
        listSprites: false,
        createSprite: {
            id: 1,
            handle: 'test',
            location: '1.0.0.0'
        },
    };

    $scope.SpriteActions = {
        createGrid: {
            id: 1,
            name: 'End of Time',
            size: 3
        },
        getStack: false,
    };

    $scope.register = {
        username: '',
        password: '',
        email: '',
        id: '',

    };
    $scope.login = {
        username: 'JFTActual',
        rawPass: '123'
    };

    $scope.request = {
        token: '',
        action: 'listSprites',
        params: {}
    };

    // $scope.dbRegister = () => {
    //     socket.emit('DB',$scope.register);
    // };

    $scope.gridClick = (r,c,type) => {
        $scope.request.params.r = r;
        $scope.request.params.c = c;
        var xy = $scope.coords(r,c);
        $scope.cX = xy[0];
        $scope.cY = xy[1];
        try{
            $scope.block = $scope.displays.grid.inventory.grid[$scope.cX][$scope.cY];
        } catch(err){}

        if($scope.pendingAction) {
            $scope.loadedAction = {
                origin: $scope.pendingAction.origin,
                target: {
                    type: type,
                    r: r,
                    c: c
                }
            };
            return;
        }
        $scope.request.action = 'gridClick';
        if(type) $scope.request.params.type = type;
        socket.emit('DB',$scope.request);
    };

    $scope.fireAction = () => {
        $scope.request.action = $scope.pendingAction.action;
        $scope.request.params = $scope.loadedAction;
        socket.emit('DB',$scope.request);
    };

    $scope.selectItem = (type,item) =>{
        $scope.request.action = 'gridClick';
        $scope.request.params.itemType = type;
        $scope.request.params.item = item;
        socket.emit('DB',$scope.request);
    };

    $scope.clearAllTarget = ()=>{
        $scope.target = null;
        $scope.pendingAction = null;
        $scope.loadedAction = null;
    };

    $scope.db = (type,action) => {
        console.log(type,action);
        var go = false;
        if(action){
            $scope[type].action = action;
            console.log($scope.Actions[action]);
            if(!$scope.Actions[action]){
                go = true;
            }
        } else {
            go = true;
        }
        $scope[type].type = type;

        if($scope[type].rawPass){
            $scope[type].password = Base64.encode($scope[type].rawPass);
        }

        // if($scope[type].password){
        //     $scope[type].password = Base64.encode($scope[type].password);
        // }
        if($scope[type].pass){
            $scope[type].pass = Base64.encode($scope[type].pass);
        }
        console.log($scope[type]);
        if(go) socket.emit('DB',$scope[type]);

    };

    function selectSprite(id){
        $scope.selectedSprite = id;
        $scope.request.action = 'selectSprite';
        $scope.request.params.spriteID = id;
        $scope.request.type = 'request';
        socket.emit('DB',$scope.request);
    }

    $scope.selectSprite = selectSprite;

    $scope.cc = {
        selected: []
    };

    $scope.select = (p) => {
        $scope.cc.selected.push(p);
        $scope.cc.save = $scope.save;
        console.log($scope.cc.selected);
        $scope.cc.step = $scope.step;

        socket.emit('cc',$scope.cc);

        // let limit = $scope.quantity <= $scope.cc.selected.length;
        // if(limit){
        //     // socket.emit('cc',$scope.cc);
        //     $scope.cc = {
        //         selected: []
        //     };
        // }

    };

    function createCharacter(p){
        console.log('cc',p);
        $scope.cc.step = 'Start';
        socket.emit('cc',$scope.cc);
    }
    $scope.ccClick = createCharacter;

    $scope.subAction = (action) => {
        let reqParams = $scope.reqParams[action];
        console.log('7', action, reqParams);
        socket.emit('DB',{
            apiVersion: '2',
            token: $scope.request.token,
            type: 'request',
            action: action,
            reqParams: reqParams
        })
    };

    $scope.clickAction = (action) => {
        $scope.pendingAction = {
            action: action,
            origin: $scope.target.data.inventory
        };
        console.log($scope.pendingAction);
    };
    socket.on('test', (msg)=> {
        console.log('===TEST===',msg);
    });
    $scope.allDat = {};

    $scope.changeAllDat = (scale) => {
        let ctx = document.getElementById("myChart").getContext("2d");
        $scope.chart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Scatter Dataset',
                    data: $scope.allDat[scale]
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        type: 'linear',
                        position: 'bottom'
                    }]
                }
            }
        });

        // $scope.chart = new Chart(ctx).Scatter([
        //     {
        //         label: 'My First dataset',
        //         strokeColor: '#F16220',
        //         pointColor: '#F16220',
        //         pointStrokeColor: '#fff',
        //         data: $scope.allDat[scale]
        //     }
        // ],{
        //     responsive: false
        // });

        console.log($scope.chart);

    };
    socket.on('crons', (msg)=> {
        console.log('===CRONS===',`---${msg.cronName}---`,msg);


        if(msg.cronName === 'ethHour'){
            let metaSet = msg.data.metaSet;

            Object.keys(metaSet).forEach(s=>{
                let sd = metaSet[s].data;
                $scope.allDat[s] = [];
                Object.keys(sd).forEach(d=>{
                    $scope.allDat[s].push({
                        x: d,
                        y: sd[d]
                    });
                });
            });

            // $scope.chart = new Chart(ctx).Scatter([
            //     {
            //         label: 'My First dataset',
            //         strokeColor: '#F16220',
            //         pointColor: '#F16220',
            //         pointStrokeColor: '#fff',
            //         data: $scope.allDat['7']
            //     }
            // ]);
            $scope.changeAllDat('7');

            // new Chart(ctx).Scatter([
            //     {
            //         label: 'My First dataset',
            //         strokeColor: '#F16220',
            //         pointColor: '#F16220',
            //         pointStrokeColor: '#fff',
            //         data: $scope.allDat['7']
            //     }
            // ]);
            // console.log($scope.allDat);
            $scope.$apply();
        }

    });

    $scope.getNumber = function(num) {
     if(num < 1) return;
     return new Array(num);
    };
    $scope.isNumber = angular.isNumber;





    socket.on('Connected', () => {
        console.info(`Server Connection Established! Welcome to the future, of science!`);
    });

    socket.on('Echo',(msg) => {
        console.log('ECHO:');
        console.log(msg);
    });

     socket.on('Actions',(msg) => {
         console.log('ACTIONS:');
         console.log(msg);
         $scope.ACTIONS = msg;
     });

    socket.on('Auth',(msg) => {
        console.log('Auth',msg);
        if(msg.sesh){
            var token = Base64.encode(msg._id + ':' + msg.sesh);
            $scope.authDat = msg;
            console.log(token);
            $scope.request.token = token;
            $scope.$apply();
        }
    });
    socket.on('Err',(msg)=>{
        $scope.err = msg;
        console.error(msg.code,msg.err);
        switch(msg.code){
            case '605':
                $scope.login.password = null;
                $scope.register.password = null;
                break;
        }
        alert(msg);
        $scope.$apply();
    });
    socket.on('Display',(msg) => {
        console.log('Display',msg);
        switch(msg.action){
            case 'update':
                $scope.displays[msg.what] = msg.with;
                if(msg.what === 'grid' && msg.with.inventory && $scope.cX && $scope.displays.grid[$scope.cX]) {
                    $scope.block = $scope.displays.grid.inventory.grid[$scope.cX][$scope.cY];
                }
                if(msg.what === 'sprites'){
                    var sprites = msg.with;
                    $scope.sprites = sprites;
                    $scope.spritesMap = {};
                    sprites.forEach(sprite =>{
                        $scope.spritesMap[sprite._id] = sprite;
                    });
                }
                if(msg.what === 'sprite'){
                    var sprite = msg.with;
                    $scope.sprite = sprite;
                }
                break;
            case 'target':
                $scope.target = {
                    name: msg.what,
                    data: msg.with
                };
                break;
        }
        $scope.$apply();
    });
    socket.on('Request',(msg) => {
        console.log('Request',msg);

    });

}]);

app.filter('percentage', function() {
    return function(input, max) {
        if (isNaN(input)) {
            return input;
        }
        return Math.floor((input * 100)) + '%';
    };
});

app.filter('orderObjectBy', function() {
    return function(items, fields, reverse) {
        var filtered;
        filtered = [];
        angular.forEach(items, function(item) {
            return filtered.push(item);
        });
        filtered.sort(function(a, b) {
            var sifted_item_a, sifted_item_b;
            sifted_item_a = a;
            sifted_item_b = b;
            angular.forEach(fields, function(field) {
                sifted_item_a = sifted_item_a[field];
                return sifted_item_b = sifted_item_b[field];
            });
            if (sifted_item_a > sifted_item_b) {
                return 1;
            } else {
                return -1;
            }
        });
        if (reverse) {
            filtered.reverse();
        }
        return filtered;
    };
});

