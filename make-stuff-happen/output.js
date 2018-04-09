//5
/*eslint no-unused-vars:1 */
const pathLib = require('path'),
    fs = require('fs'),
    chalk = require('chalk');

//takes the path given by the user, and the final pages.
module.exports = function output(err, pages) {
    var currentPath = document.getElementById('uploadFile').files[0].path;
    if (err) {
        console.error(err);
        return;
    }
    var timestamp = Date.now(),
        //instead of  using timestamp, use fs.readlinkSync to name it the same as the course w/the extra word 'new' or something
        newPath = pathLib.resolve(currentPath, 'updatedFiles ' + timestamp);
    fs.mkdirSync(newPath);
    pages.forEach(function (page) {
        var parsedPath = pathLib.parse(page.file),
            fileName = parsedPath.name + parsedPath.ext,
            path = pathLib.join(newPath, fileName);
        fs.writeFileSync(path, page.contents);
    });
    console.log(chalk.cyan('PROCESS COMPLETE! Find the updated files in: ' + newPath));
};