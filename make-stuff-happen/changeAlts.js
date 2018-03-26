//3
const pathLib = require('path'),
    chalk = require('chalk'),
    output = require('./output.js');

module.exports = function changeAlts(err, pages, newAltImgs) {
    if (err) {
        console.error(err);
        return;
    }
    //3.After button is selected, use this function to change the pages based on the last function
    pages.forEach(function (page) {
        //images from the page object mapped previously
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
        page.html = page.dom.html();
        //could take the dom out since you're already saving it 
    });
    //helper function to change the alt text on the actual page, not just on the object
    function changeAlt(image, newAlt) {
        image.attr('alt', newAlt);
    }
    output(null, pages);
};