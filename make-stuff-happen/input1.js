//1
/*eslint no-unused-vars:1 */
/*eslint no-redeclare:1 */
const cheerio = require('cheerio'),
    fs = require('fs'),
    pathLib = require('path'),
    chalk = require('chalk'),
    injectContents = require('./make-stuff-happen/injectContents.js');
var htmlFiles;

function isUrl(urlString) {
    return urlString.includes('http');
}

function isValidPath(imgPath) {
    var isValid;
    fs.access(imgPath, (err, isValid) => {
        if (err) {
            isValid = false;
        } else {
            isValid = true;
        }
        return isValid;
    });
}
var imgId = 0;

function iterateId(n) {
    imgId = imgId + n;
    return imgId;
}

function getImagesToName() {
    //cannot read path property of this?
    var currentPath = document.getElementById('uploadFile').files[0].path;
    console.log('chosen path: ', currentPath);
    if (currentPath == undefined) {
        console.log('INVALID path chosen by user. Please try again.');
    } else if (isValidPath(currentPath) !== true) {
        console.log('INVALID path chosen by user. Please try again.');
    }

    //1A. (on installation/first click) retrieve all the html files from the files
    function getAllPages() {
        htmlFiles = fs.readdir(currentPath, function (err, files) {
            if (err) {
                console.log(err);
            }
            return files;
        }).filter((file) => {
            return file.includes('.html');
        }).map((file) => {
            var correctPath = pathLib.resolve(currentPath, file);
            return {
                file: file,
                contents: fs.readFileSync(correctPath, 'utf8')
            };
        });
        pagesToImageObjs(null, htmlFiles);
    }

    //1B. (on installation/first click) once all images are retrieved, turn them into objects.
    function pagesToImageObjs(err, htmlFiles) {
        if (err) {
            console.error(err);
            return;
        }
        var alts = {
            noAltImgs: [],
            brokenImgs: []
        };

        //don't need to catch the reduce contents because you're editing the obj thats being passed
        htmlFiles.reduce(function (alts, file) {
            //parse the html with cheerio
            file.dom = cheerio.load(file.contents);
            var images = file.dom('img');
            file.images = [],
                file.brokenImgs = [];
            images.each(function (i, image) {
                image = file.dom(image);
                var alt = image.attr('alt'),
                    //take out the session val added by electron
                    src = pathLib.resolve(currentPath, image.attr('src').split('?')[0]),
                    imageName = pathLib.parse(src).name,
                    ext = pathLib.parse(src).ext,
                    newSrc;
                //if it's not a valid path, then identify it as a broken image.
                if (isValidPath(src) == false) {
                    var item = {
                        imageFile: file.file,
                        source: src
                    };
                    file.brokenImgs.push(item);
                    alts.brokenImgs.push(item);
                }
                if (src.includes('Course%20Files')) {
                    newSrc = `Course%20Files/${imageName + ext}`;
                    file.images.push(image);
                } else if (src.includes('Web%20Files')) {
                    newSrc = `Web%20Files/${imageName + ext}`;
                } else {
                    //leave this here to handle equella links
                    newSrc = src;
                }
                if (!alt || alt === '') {
                    if (!src) {
                        console.log('image does not exist');
                        return;
                    } else if (!isUrl(src)) {
                        var source = pathLib.resolve(currentPath, newSrc);
                    } else {
                        source = src;
                    }
                    //push each image obj to later match it with an imgID
                    //no id...?
                    alts.noAltImgs.push({
                        source: source,
                        imageFile: file.file,
                        id: iterateId(1)
                    });
                    file.images.push(image);
                }
            });
            return alts;
        }, alts);
        console.log(chalk.magenta(' # images to name:', alts.noAltImgs.length));
        //only gets passed once...
        injectContents(null, htmlFiles, alts.noAltImgs, alts.brokenImgs);
    }
    getAllPages();
}