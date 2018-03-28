//2
/*eslint no-unused-vars:1 */
const injectHtml = require('../injectHtml.js'),
    changeAlts = require('./changeAlts.js'),
    pathLib = require('path');

module.exports = function (err, path, pages, noAltImgs, imageIDs) {
    //2. After all images are retrieved, inject each image into the html page.
    noAltImgs.forEach(function (image) {
        // image.source = pathLib.resolve(path, image.source.split('?')[0]);
        var document = window.document;
        var div = document.getElementById('bodyDiv');
        //inject image 
        console.log('PASSED SOURCE ', image.source);
        div.innerHTML = injectHtml(image.imageFile, image.source, image.imgId);
        //this returns the index # 
        var equalIds = imageIDs.find((i) => {
            return image.imgId === i;
        });
        if (equalIds.typeOf == 'number') {
            //getText(image);
        } else {
            //changeAlts(err, null, null);
        }
    });

    /*this should happen after the user does stuff. May need to move to a new function */
    /*function getText(image) {
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
    changeAlts(null, pages, noAltImgs);*/
};