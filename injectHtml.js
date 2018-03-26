module.exports = (filename, image, inputId) => {
    `<h2>File: ${filename}</h2>
    <div class="imageDiv">${image}</div>
    <p>Alt: </p><input type ="text" id='${inputId}'>`;
};