//1
/*eslint no-unused-vars:1 */
/*eslint no-undef:1 */
const injectContents = require('./make-stuff-happen/injectContents.js');

function getImagesToName() {
    var myPages = pages.getPages();
    if (myPages === undefined) {
        injectContents('Pages are undefined', null, null);
    } else if (myPages.length === 0) {
        injectContents('There are no pages.', null, null);
    }
    var imagesToInject = pages.convertPages(null, myPages);
    if (imagesToInject == undefined) {
        injectContents('Images to Inject is undefined', null, null);
    } else if (imagesToInject.noAltImgs.length === 0) {
        injectContents('There are no images to name.', null, null);
    }
    injectContents(null, imagesToInject.noAltImgs, imagesToInject.brokenImgs);
}