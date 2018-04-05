/*eslint no-unused-vars:1 */
/*eslint no-undef:1 */
const cheerio = require('cheerio'),
    pathLib = require('path'),
    fs = require('fs'),
    chalk = require('chalk');
var htmlFiles;

//helper functions
function isUrl(urlString) {
    return urlString.includes('http://');
}

function isValidPath(imgPath) {
    var isValid;
    fs.access(imgPath, (err, isValid) => {
        if (err) {
            isValid = false;
            // callback(err);
        } else {
            isValid = true;
        }
        return isValid;
    });
}

function decodeMe(imgPath) {
    return decodeURI(imgPath);
}
var imgId = 0;

function iterateId(n) {
    imgId = imgId + n;
    return imgId;
}

function getCurrentPath() {
    var currentPath = document.getElementById('uploadFile').files[0].path;
    if (currentPath === undefined) {
        console.log('invalid folder. changing to current directory.');
        return pathLib.resolve(__dirname);
    }
    return currentPath;
}


//1A. (on installation/first click) retrieve all the html files from the files
function getAllPages() {
    htmlFiles = fs.readdirSync(getCurrentPath())
        .filter(function (file) {
            return file.includes('.html');
        }).map(function (file) {
            var correctPath = pathLib.resolve(getCurrentPath(), file);
            if (correctPath == undefined) {
                pagesToImageObjs('current path is undefined', null);
            }
            return {
                file: file,
                contents: fs.readFileSync(correctPath, 'utf8')
            };
        });
    return htmlFiles;
}

//1B. (on installation/first click) once all images are retrieved, turn them into objects.
function pagesToImageObjs(err, htmlFiles) {
    if (err) {
        console.log(err);
        return;
    }
    var alts = {
        noAltImgs: [],
        brokenImgs: []
    };

    //don't need to catch the reduce contents because you're editing the obj thats being passed
    newFiles = htmlFiles.reduce(function (alts, file) {
        //parse the html with cheerio
        file.dom = cheerio.load(file.contents);
        var images = file.dom('img');
        file.images = [];
        images.each(function (i, image) {
            image = file.dom(image);
            var alt = image.attr('alt'),
                //take out the session val added by electron
                src = pathLib.resolve(getCurrentPath(), image.attr('src').split('?')[0]),
                newSrc = decodeMe(src);

            //if it's not a valid path, then identify it as a broken image.
            if (isValidPath(newSrc) == false || !isUrl(newSrc)) {
                //leave this here to handle equella links
                newSrc = src;
                alts.brokenImgs.push({
                    imageFile: file.file,
                    source: newSrc
                });
            } else if (newSrc.includes('Course Files')) {
                file.images.push(image);
            }
            if (!alt || alt === '') {
                //if the src attribute doesnt exist
                if (!src || src === '') {
                    console.log('image does not exist');
                } //else if its still not a valid path, 
                else if (!isUrl(newSrc)) {
                    var source = pathLib.resolve(getCurrentPath(), newSrc);
                } //else, its a valid path, so make the source the decoded newSrc 
                else {
                    source = newSrc;
                }
                //push each image obj to later match it with an imgID
                alts.noAltImgs.push({
                    source: source,
                    imageFile: file.file,
                    id: iterateId(1)
                });
            }
        });
        return alts;
    }, alts);
    console.log(chalk.magenta(' # images to name:', alts.noAltImgs.length));
    return newFiles;
}
//you'll have to match up the images you receive with the images on page.images
function matchStuff(newImgs) {
    //define pages with functions already on the page.
    var pages = getAllPages();
    //define old images with functions already on the page.
    var oldImgs = pagesToImageObjs(null, pages).noAltImgs;
    console.log('The images I want are: ', oldImgs);
    pages.forEach(function (page) {
        oldImgs.forEach(function (image) {
            var imageName = pathLib.basename(image.source);
            console.log('image name :: ', image);
            newImgs.forEach(function (newImg) {
                console.log('old image', imageName);
                console.log('new image: ', image.name);
                if (newImg.name === imageName) {
                    page.images.push(newImg);
                }
            });
        });
    });
}
module.exports = {
    getPath: getCurrentPath,
    getPages: getAllPages,
    getImages: pagesToImageObjs,
    match: matchStuff
};