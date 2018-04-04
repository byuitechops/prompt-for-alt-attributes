//3
/*eslint no-unused-vars:1 */
const pathLib = require('path');
var changeAlts = require('./make-stuff-happen/changeAlts.js');

/*--------------------------
HAPPENS AFTER USER SUBMITS
--------------------------*/
function makeHtmlChanges() {
    var images = document.querySelectorAll('img');
    var inputs = document.querySelectorAll('input'),
        textList = [],
        updatedImages = [];
    inputs.forEach(function (text) {
        if (text.value !== '') {
            textList.push({
                id: text.id,
                text: text.value
            });
        }
    });
    images.forEach(function (image) {
        var imageName = pathLib.basename(image);
        textList.forEach(function (text) {
            if (text.id === image.id) {
                updatedImages.push({
                    name: imageName,
                    id: image.id,
                    source: image.source,
                    alt: text.text
                });
            }
        });
    });
    changeAlts(null, updatedImages);
}