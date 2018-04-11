//2.5
const pathLib1 = require('path');

function regular(filename, image, id) {
    var imageName = pathLib1.basename(image);
    return `<h2>File: ${filename}</h2>
    <h3>Image: ${imageName}</h3>
    <div class="imageDiv brokenImage">
    <img src="${image}" id ='${id}'>
    </div>
    <input type ="text" class = 'altInput' id='${id}' placeholder =' Input Alt Text Here'>`;
}

function broken(filename, image) {
    var imageName = pathLib1.basename(image);
    return `<h2 class = "brokenImage">File: ${filename}</h2>
    <h3 class="broken">Broken Image: ${imageName}</h3>
    <p class="broken">NOTE: This image source is invalid. Please use the file name and image name to fix the image in the course.</p>`;
}
module.exports = {
    regularImage: regular,
    brokenImage: broken
};