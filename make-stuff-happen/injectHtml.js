//2.5
const pathLib = require('path');
module.exports = (filename, image, id) => {
    var imageName = pathLib.basename(image);
    return `<h2>File: ${filename}</h2>
    <h3>Image: ${imageName}</h3>
    <div class="imageDiv brokenImage">
    <img src="${image}" id ='${id}'>
    </div>
    <input type ="text" class = 'altInput' id='${id}' placeholder =' Input Alt Text Here'>`;
};