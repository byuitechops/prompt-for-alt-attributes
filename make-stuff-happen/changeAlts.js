//4
/*eslint no-undef:1 */
/*eslint no-debugger:1 */
const pathLib = require('path'),
    chalk = require('chalk'),
    output = require('./output.js'),
    cheerio = require('cheerio');

module.exports = function changeAlts(err, newPages) {
    if (err) {
        console.error(err);
        return;
    }
    debugger;
    newPages.forEach(function (page) {
        cheerio.load(page.contents);
        page.newImages.forEach(function (image) {
            //for each new image, find its matching image on the page
            //TRYING TO GET THIS IMAGES TO HTML THING MATCHED UP -- maybe use old "newAlt" file as a reference
            page.images.each(function (old) {
                debugger;
                var imageName = pathLib.basename(old.source);
                console.log('old source', imageName);
                console.log('new source', image.name);
                //match old image sources by the new ones.. by name
                if (imageName === image.name) {
                    console.log(chalk.bgGreen('MATCH ' + image.name));
                    changeAlt(image, image.alt);
                }
            });
        });
    });
    //helper function to change the alt text on the actual page, not just on the object
    function changeAlt(image, newAlt) {
        if (newAlt === ' ' || newAlt === '') {
            output('Empty text is not allowed.');
        }
        debugger;
        image.attr('alt', newAlt);
    }
    output(null, newPages);
};