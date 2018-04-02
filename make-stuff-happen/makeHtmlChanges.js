/*eslint no-unused-vars:1 */
var changeAlts = require('./make-stuff-happen/changeAlts.js');

/*--------------------------------------
NEXT PART HAPPENS AFTER USER SUBMITS
--------------------------------------*/
//how is noAltImgs gonna be defined if this happens after a click event?
function makeHtmlChanges(err, pages /* , noAltImgs */ ) {
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
    //this function needs to be wrapped in a noAltImgs.forEach.
    textList.forEach(function (text) {
        //if text id = image id, then call makeChanges(image, text.text)
        if (text.id) {
            makeChanges( /*,*/ text.text);
        }
    });

    function makeChanges(image, text) {
        //add text as the new alt property
        //noAltImgs.forEach((altImg)=>{});
        image.alt === text;
    }
    changeAlts(null, pages);
}