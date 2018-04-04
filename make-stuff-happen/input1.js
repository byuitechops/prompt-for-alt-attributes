//1
/*eslint no-unused-vars:1 */
const cheerio = require('cheerio'),
    fs = require('fs'),
    pathLib = require('path'),
    chalk = require('chalk'),
    injectContents = require('./make-stuff-happen/injectContents.js');
var htmlFiles;

function isUrl(urlString) {
    return urlString.includes('http://');
}

function isValidPath(imgPath, callback) {
    var isValid;
    fs.access(imgPath, (err, isValid) => {
        if (err) {
            isValid = false;
            callback(err);
        } else {
            isValid = true;
        }
        callback(null, isValid);
        // return isValid;
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

function getImagesToName() {
    var currentPath = document.getElementById('uploadFile').files[0].path;
    if (currentPath === undefined) {
        console.log('UNDEFINED path. Please try again.');
        return;
    } else if (isValidPath(currentPath) === false) {
        console.log('INVALID path chosen by user. Please try again.');
        return;
    }

    //1A. (on installation/first click) retrieve all the html files from the files
    function getAllPages() {
        htmlFiles = fs.readdirSync(currentPath)
            .filter(function (file) {
                return file.includes('.html');
            }).map(function (file) {
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
            file.images = [];
            images.each(function (i, image) {
                image = file.dom(image);
                var alt = image.attr('alt'),
                    //take out the session val added by electron
                    src = pathLib.resolve(currentPath, image.attr('src').split('?')[0]),
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
                        var source = pathLib.resolve(currentPath, newSrc);
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
        console.log('# broken images: ', alts.brokenImgs.length);
        console.log(chalk.magenta(' # images to name:', alts.noAltImgs.length));
        //only gets passed once...
        injectContents(null, alts.noAltImgs, alts.brokenImgs);
    }
    getAllPages();
}