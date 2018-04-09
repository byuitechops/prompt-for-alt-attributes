//4
/*eslint no-debugger:1 */
const pathLib = require('path'),
    output = require('./output.js'),
    $ = require('cheerio');

module.exports = function changeAlts(err, pages) {
    if (err) {
        console.error(err);
        return;
    }
    pages.map(function (page) {
        //get an array of the CHEERIO IMG OBJS on the page
        var htmlImages = page.cheerioImgs;
        //for every new image, find the matching image in page.contents,
        htmlImages.forEach(function (cheerioImg) {
            cheerioImg = $(cheerioImg);
            var imageName = pathLib.basename(cheerioImg.attr('src'));
            page.newImages.forEach(function (newImg) {
                if (newImg.name === imageName) {
                    changeAlt(cheerioImg, newImg.alt);
                }
            });
        });

        return pages;
    });
    // and add the alt attribute to the html page.
    function changeAlt(image, newAlt) {
        if (newAlt === ' ' || newAlt === '') {
            output('Empty text is not allowed.');
        }
        debugger;
        image.attr('alt', newAlt);
        //can't get this function to change anything on the object!?!?
        console.log('changed image: ', image);
    }
    output(null, pages);
};