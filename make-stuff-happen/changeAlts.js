//4
/*eslint no-debugger:1 */
const pathLib = require('path'),
    output = require('./output.js');

module.exports = function changeAlts(err, pages) {
    if (err) {
        console.error(err);
        return;
    }
    pages.forEach(function (page) {
        //get an array of the CHEERIO IMG OBJS on the page
        var htmlImages = page.cheerioImgs;
        page.newImages.forEach(function (newImg) {
            var found = htmlImages.find(function (image) {
                var imageName = pathLib.basename(image.attr('src'));
                return imageName === newImg.name;
            });
            if (found) {
                // and add the alt attribute to the html page.
                found.attr('alt', newImg.alt);
                console.log('the item was: ', found);
            }
        });
        //could take the dom out since you're already saving it
        page.html = page.dom.html();
    });
    output(null, pages);
};