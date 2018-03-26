var fs = require('fs'),
    myPath = fs.readlinkSync('.');
console.log(myPath);