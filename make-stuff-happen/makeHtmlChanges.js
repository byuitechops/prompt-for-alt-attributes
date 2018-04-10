//3
/*eslint no-unused-vars:1 */
const pathLib = require('path');
var changeAlts = require('./make-stuff-happen/changeAlts.js'),
    pages = require('./make-stuff-happen/pages.js');

//HAPPENS AFTER USER SUBMITS
function makeHtmlChanges() {
    var images = document.querySelectorAll('img');
    var inputs = document.querySelectorAll('input'),
        textList = [],
        updatedImages = [];
    inputs.forEach(function (text) {
        if (text.value !== '' || text.value !== null) {
            textList.push({
                id: text.id,
                text: text.value
            });
        }
    });
    //get new properties for images
    images.forEach(function (image) {
        var imageName = pathLib.basename(image.src);
        textList.forEach(function (text) {
            //match the image and the textInput by id
            if (text.id === image.id) {
                updatedImages.push({
                    name: imageName,
                    id: image.id,
                    source: image.src,
                    alt: text.text
                });
            }
        });
    });
    var updatedPages = pages.match(updatedImages);
    changeAlts(null, updatedPages);
}