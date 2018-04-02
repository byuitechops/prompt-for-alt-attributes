//3
/*eslint no-unused-vars:1 */
var changeAlts = require('./make-stuff-happen/changeAlts.js');

/*--------------------------
HAPPENS AFTER USER SUBMITS
--------------------------*/
function makeHtmlChanges(err, pages) {
    var images = document.querySelectorAll('img');
    var inputs = document.querySelectorAll('input'),
        textList = [];
    inputs.forEach(function (text) {
        if (text.value !== '') {
            textList.push({
                id: text.id,
                text: text.value
            });
        }
    });
    images.forEach(function (image) {
        textList.forEach(function (text) {
            if (text.id === image.id) {
                makeChanges(image, text.text);
            }
        });
    });

    function makeChanges(image, text) {
        //add text as the new alt property
        image.alt === text;
    }
    changeAlts(null, pages);
}