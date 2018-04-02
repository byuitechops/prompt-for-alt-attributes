//2
const injectHtml = require('./injectHtml.js'),
    injectBrokenImgHtml = require('./injectBrokenImgHtml.js');

module.exports = function (err, path, pages, noAltImgs, brokenImages) {
    //2. After all images are retrieved, inject each image into the html page.
    noAltImgs.forEach(function (image) {
        var document = window.document;
        //create a new div each time, and not in the same div
        var div = document.createElement('div', 'class="bodyDiv"');
        // var div = document.getElementById('bodyDiv');
        if (typeof image.source === 'undefined') {

            console.log('source undefined', image);
        }
        div.innerHTML = injectHtml(image.imageFile, image.source, image.imgId);
        document.body.appendChild(div);
    });
    //broken images is weird now. Non broken are showing up.
    brokenImages.forEach(function (brokenImg) {
        console.log('BROKEN IMAGE -', brokenImg.source);
        var document = window.document;
        var div = document.createElement('div');
        div.innerHTML = injectBrokenImgHtml(brokenImg.imageFile, brokenImg.source);
        document.body.appendChild(div);
    });
};