const pathLib = require('path');
module.exports = (filename, image, inputId) => {
    var imageName = pathLib.basename(image);
    return `<h2>File: ${filename}</h2>
    <h3>Image: ${imageName}</h3>
    <img src="${image}" id ='${inputId}' class="imageDiv">
    <p>Alt: </p><input type ="text" id='${inputId}'>`;
};