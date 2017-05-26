console.log('STARTING... ' + __filename);

let pack = CORE.Package,
    short = CORE.Git.short,
    branch = CORE.Git.branch;


/// LOG \/
eLog(`
.   ${pack.name} Server v${pack.version}
.   Created By: ${pack.meta.creator}
.   Maintained By: ${pack.meta.maintainer}
.   Current Commit: ${short} - ${branch}
.   Running on NodeJS ${process.version}
    . 
    .   "Hello, Dave. You're looking well today...."
    . 
            `,0,'yellow');
/// LOG /\


