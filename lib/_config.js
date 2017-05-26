module.exports = {
    expressPort: process && process.env && process.env.PORT || 3030,
    logLevel: 3,
    oLogThresh: 1,
    resetDB: false,
    dbURL: process.env.MONGODB_URI ? process.env.MONGODB_URI : '127.0.0.1:27017/UniCoreTest', //'localhost:27017/UniCoreTest',
    smtpsPath: process.env.SMTPS_PATH,
    appDomain: '@test.net',
    emailFrom: 'admin',
    singleSprite: true,
    // dbModels: [
    //     'Accounts',
    //     'Sprites',
    // ],
    // activeApps: [ // Warning, non-unique module names will be overridden.
    //     'eden'
    // ]
};

/**
 * Created by john.thantranon on 10/19/2016.
 */