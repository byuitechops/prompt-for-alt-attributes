//2
const injectHtml = require('../injectHtml.js'),
    changeAlts = require('./make-stuff-happen/changeAlts.js');

module.exports = function (err, pages, noAltImgs, imageIDs) {
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
            changeAlts(err, null, null);
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