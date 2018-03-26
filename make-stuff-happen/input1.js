//1
/*eslint no-unused-vars:1 */
const cheerio = require('cheerio'),
    fs = require('fs'),
    pathLib = require('path'),
    chalk = require('chalk'),
    injectContents = require('./make-stuff-happen/injectContents.js');

function getImagesToName() {
    var currentPath = document.getElementById('uploadFile').files[0].path;
    if (currentPath !== undefined) {
        console.log(chalk.green('Valid Path:', currentPath));
    }
    var imgId = 0;

    function iterateId(n) {
        imgId = imgId + n;
    }
    //1A. (on installation/first click) retrieve all the html files from the files
    function getAllPages() {
        var htmlFiles = fs.readdirSync(currentPath)
            .filter(function (file) {
                return file.includes('.html');
            })
            .map(function (file) {
                return {
                    file: file,
                    contents: fs.readFileSync(pathLib.resolve(currentPath, file), 'utf8')
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
            imgIds: []
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
                    src = image.attr('src');
                if (!alt || alt === '') {
                    // make a list of the alt attributes
                    var filename = pathLib.basename(src),
                        source = pathLib.resolve(pathLib.dirname(src), filename);
                    //push each image obj to later match it with an imgID
                    iterateId(1);
                    alts.noAltImgs.push({
                        source: source,
                        imageFile: file.file,
                        imgId: imgId
                    });
                    alts.imgIds.push(imgId);
                    file.images.push(image);
                } else if (src.includes('Course%20Files')) {
                    file.images.push(image);
                }
            });
            return alts;
        }, alts);
        console.log(chalk.magenta(' # images to name:', alts.noAltImgs.length));
        injectContents(null, htmlFiles, alts.noAltImgs, alts.imgIds);
    }
    getAllPages();
}