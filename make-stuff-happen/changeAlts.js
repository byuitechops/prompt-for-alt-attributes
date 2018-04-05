//4
const pathLib = require('path'),
    chalk = require('chalk'),
    output = require('./output.js'),
    pages = require('./pages.js');

module.exports = function changeAlts(err, newAltImgs) {
    if (err) {
        console.error(err);
        return;
    }
    var allPages = pages.getPages();
    allPages.forEach(function (page) {
        page.images.forEach(function (image) {
            image = page.dom(image);
            var src = image.attr('src');
            image.source = pathLib.basename(src);
            var oldSrc = image.source;
            //match by src
            newAltImgs.forEach(function (newAltImage) {
                var newSrc = pathLib.basename(newAltImage.source);
                if (newSrc === oldSrc) {
                    console.log(chalk.bgGreen('MATCH ' + newAltImage.imageFile));
                    changeAlt(image, newAltImage.alt);
                }
            });
        });
    });
    //helper function to change the alt text on the actual page, not just on the object
    function changeAlt(image, newAlt) {
        image.attr('alt', newAlt);
    }
    output(null, allPages);
};