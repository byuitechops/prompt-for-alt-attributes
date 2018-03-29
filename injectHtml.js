const pathLib = require('path');
module.exports = (filename, image, inputId) => {
    return `<h2>File: ${filename}</h2>
    <h3>Image: ${pathLib.basename(image)}</h3>
    <div class="imageDiv">
    <img src="${image}" id ='${inputId}'>
    </div>
    <input type ="text" class = 'altInput' id='${inputId}' placeholder =' Input Alt Text Here'>`;
};