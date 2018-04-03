//2.5
// const pathLib = require('path');
// ${pathLib.parse(image).base}
module.exports = (filename, image, id) => {
    return `<h2>File: ${filename}</h2>
    <h3>Image: </h3>
    <div class="imageDiv brokenImage">
    <img src="${image}" id ='${id}'>
    </div>
    <input type ="text" class = 'altInput' id='${id}' placeholder =' Input Alt Text Here'>`;
};