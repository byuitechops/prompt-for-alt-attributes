/*eslint no-unused-vars:1 */
/*eslint no-debugger:1 */
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
    try {
        fs.accessSync(imgPath);
        return true;
    } catch (err) {
        return false;
    }
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
        pagesToImageObjs('invalid folder. changing to current directory.', null);
        return pathLib.resolve(__dirname);
    }
    return currentPath;
}


//1A. (on installation/first click) retrieve all the html files from the files
function getAllPages() {
    var filepath = getCurrentPath();
    console.log('file path: ', filepath);
    htmlFiles = fs.readdirSync(filepath)
        .filter(function (file) {
            return file.includes('.html');
        }).map(function (file) {
            var correctPath = pathLib.resolve(filepath, file);
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
        brokenImgs: [],
        fileImgs: []
    };

    //don't need to catch the reduce contents because you're editing the obj thats being passed
    var newFiles = htmlFiles.reduce(function (alts, file) {
        //parse the html with cheerio
        file.dom = cheerio.load(file.contents);
        var images = file.dom('img');
        file.images = [];
        images.each(function (i, image) {
            image = file.dom(image);
            alts.fileImgs.push(image);
            //take out the session val added by electron
            var src = pathLib.resolve(getCurrentPath(), image.attr('src').split('?')[0]),
                newSrc = decodeMe(src);
            //if it's not a valid path, then identify it as a broken image.
            if (isValidPath(newSrc) == false || isUrl(newSrc) == true || !src || src == '') {
                //reset the newSrc to match the original source
                newSrc = src;
                alts.brokenImgs.push({
                    imageFile: file.file,
                    source: newSrc
                });
            } else { //it's not a broken image, so it can be manipulated.
                file.images.push(image);
                var alt = image.attr('alt');
                if (alt === '' || alt == undefined) {
                    var source = pathLib.resolve(getCurrentPath(), newSrc);
                    alts.noAltImgs.push({
                        source: source,
                        imageFile: file.file,
                        id: iterateId(1)
                    });
                }
            }

        });
        file.cheerioImgs = alts.fileImgs;
        return alts;
    }, alts);
    console.log(chalk.magenta(' # images to name:', alts.noAltImgs.length));
    return newFiles;
}
//you'll have to match up the images you receive with the images on page.images
function matchStuff(newImgs) {
    var pages = getAllPages();
    var oldImgs = pagesToImageObjs(null, pages).noAltImgs;
    pages.map(function (page) {
        page.newImages = [];
        //map the oldImages to the new ones that have the same name, 
        newImgs.forEach(function (newImg) {
            oldImgs.forEach(function (image) {
                var imageName = pathLib.basename(image.source);
                if (imageName === newImg.name) {
                    page.newImages.push(newImg);
                }
            });
        });
        return pages;
    });
    return pages;
}
module.exports = {
    getPath: getCurrentPath,
    getPages: getAllPages,
    convertPages: pagesToImageObjs,
    match: matchStuff
};