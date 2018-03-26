/*eslint no-undef:1 */
const injectHtml = require('./injectHtml.js'),
    changeAlts = require('./addAlt3.js');

module.exports = (err, pages, noAltImgs, imageIDs) => {
    //2. After all images are retrieved, inject each image into the html page.
    noAltImgs.forEach(function (image) {
        var document = window.document;
        var div = document.getElementById('bodyDiv');
        //inject image 
        div.innerHTML = injectHtml(image.imageFile, image.source, image.imgId);
        //this returns the index # 
        var equalIds = imageIDs.find((i) => {
            return image.imgId === i;
        });
        if (equalIds.typeOf == 'number') {
            getText(image);
        } else {
            console.log(chalk.red('ERROR: Equal Ids was not identified correctly.'));
        }
    });

    function getText(image) {
        var imgId = image.imgId,
            //grab the text from the input box based on what image it is
            text = window.document.getElementById(imgId).innerHTML();
        makeChanges(image, text);
    }

    function makeChanges(image, text) {
        //add text as the new alt property
        noAltImgs.forEach((image) => {
            image.alt === text;
        });
    }
    changeAlts(null, pages, noAltImgs);
};