let fs = require('fs');
module.exports = (function () {
    const basePath = __dirname + '/globals';
    fs.readdirSync(basePath).forEach(file => {
        console.log(file);
        require('./globals/' + file)
    });
})();