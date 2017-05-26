CORE.Tools = {};
let fs = require('fs');
const basePath = __dirname + '/tools';
fs.readdirSync(basePath).forEach(file => require('./tools/' + file));
fs.readdirSync(process.cwd()+`\\lib\\tools`).forEach(file => require(process.cwd()+`\\lib\\tools\\` + file));
return;

// let fs = require('fs');
//
// module.exports = (function () {
//     let instance;
//     return { getInstance: () => instance || start() };
//
//     function start(){
//         console.log('STARTING... ' + __filename);
//
//         instance = {
//             GetDir: GetDir,
//             ParseDirFiles: ParseDirFiles,
//             CopyFile: CopyFile,
//             InitFile: InitFile,
//         };
//
//         function GetDir(path){
//             const basePath = path || __dirname + '/';
//             return fs.readdirSync(basePath);
//         }
//         function ParseDirFiles(fArray,prefix){
//             fArray.forEach(file => {
//                 const splitFile = file.split('.');
//                 if(splitFile[0] === prefix) {
//                     console.log(file.split('.js')[0].split('.')[1]);
//                 }
//             });
//         }
//
//         function CopyFile(source, target, cb){
//             let cbCalled = false;
//             target = target.substr(1);
//
//             let rd = fs.createReadStream(source);
//             rd.on("error", function(err) {
//                 done(err);
//             });
//             let wr = fs.createWriteStream(target);
//             wr.on("error", function(err) {
//                 done(err);
//             });
//             wr.on("close", function(ex) {
//                 done();
//             });
//             rd.pipe(wr);
//
//             function done(err) {
//                 if (!cbCalled) {
//                     cb(err);
//                     cbCalled = true;
//                 }
//             }
//         }
//
//         function InitFile(source,target){
//             let file;
//             try{
//                 file = require(target);
//                 if(file) return file;
//             } catch(err){
//                 if(err) console.log(`Config file not found. Creating...`);
//                 CORE.Tools.CopyFile(source,target, (err) => {
//                     if(err) console.log(err);
//                     console.log('Config file created. Please set options in /lib/_config.js before restarting');
//                     process.exit(100);
//                 });
//             }
//         }
//
//         return instance;
//     }
// })();
//
//
//
// /**
//  * Created by jftac on 2/13/2017.
//  */
