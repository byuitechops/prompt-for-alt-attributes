//2.75
module.exports = (filename, image) => {
    return `<h2 class = "brokenImage">File: ${filename}</h2>
    <h3>Broken Image: ${image.source}</h3>
    <p class = "brokenImage">The src attribute of this image has one of the following problems: </p>
    <ul>
        <li class = "brokenImage">It contains nonexistent folders in its path located in the src attribute</li>
        <li class = "brokenImage">It is linked to a file from a different course.</li>
    </ul>
    <p class = "brokenImage">If you would like to solve this issue now, use the filename and image name listed above to fix the issue in D2L, 
    then restart this program to add an alt attribute.</p>`;
};