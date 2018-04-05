//2
const injectHtml = require('./injectHtml.js'),
    injectBrokenImgHtml = require('./injectBrokenImgHtml.js');

module.exports = function (err, noAltImgs, brokenImages) {
    if (err) {
        console.log(err);
        return;
    }
    //2. After all images are retrieved, inject each image into the html page.
    var document = window.document;
    noAltImgs.forEach(function (image) {
        //create a new div each time, and not in the same div
        var div = document.createElement('div');
        div.innerHTML = injectHtml(image.imageFile, image.source, image.id);
        document.body.appendChild(div);
    });
    //I don't know how to catch this from the browser
    brokenImages.forEach(function (brokenImg) {
        var div = document.createElement('div', 'class="broken"');
        div.innerHTML = injectBrokenImgHtml(brokenImg.imageFile, brokenImg.source);
        document.body.appendChild(div);
    });
};