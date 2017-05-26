module.exports = {
    expressPort: process && process.env && process.env.PORT || 3030,
    logLevel: 1,
    oLogThresh: 3,
    resetDB: false,
    dbURL: process.env.MONGODB_URI ? process.env.MONGODB_URI : '127.0.0.1:27017/UniCoreTest', //'localhost:27017/UniCoreTest',
    smtpsPath: process.env.SMTPS_PATH,
    appDomain: '@test.net',
    emailFrom: 'admin',
    singleSprite: true,
};

/**
 * Created by john.thantranon on 10/19/2016.
 */