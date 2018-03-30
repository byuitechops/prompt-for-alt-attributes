//1
/*eslint no-unused-vars:1 */
/*eslint no-redeclare:1 */
const cheerio = require('cheerio'),
    fs = require('fs'),
    pathLib = require('path'),
    chalk = require('chalk'),
    injectContents = require('./make-stuff-happen/injectContents.js');

function isUrl(urlString) {
    return urlString.includes('http');
}

function isValidPath(imgPath) {
    var isValid;
    // imgPath = imgPath.replace(/%20/g, ' '); //regex /g thing.
    fs.access(imgPath, (err, isValid) => {
        if (err) {
            isValid = false;
        } else {
            isValid = true;
        }
        return isValid;
    });
}

function getImagesToName() {
    var currentPath = document.getElementById('uploadFile').files[0].path;
    if (currentPath == undefined) {
        console.log('INVALID path chosen by user.');
    }

    //1A. (on installation/first click) retrieve all the html files from the files
    function getAllPages() {
        var htmlFiles = fs.readdirSync(currentPath)
            .filter(function (file) {
                return file.includes('.html');
            })
            .map(function (file) {
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
                //FIND OUT WHY IT'S ALWAYS EVALUATING AS TRUE IN THE ELECTRON CONSOLE
                console.log('src: ', src);
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
                    alts.noAltImgs.push({
                        source: source,
                        imageFile: file.file,
                    });
                    file.images.push(image);
                }
            });
            return alts;
        }, alts);
        console.log(chalk.magenta(' # images to name:', alts.noAltImgs.length));
        //only gets passed once...
        injectContents(null, currentPath, htmlFiles, alts.noAltImgs, alts.brokenImgs);
    }
    getAllPages();
}