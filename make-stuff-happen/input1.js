const cheerio = require('cheerio'),
    async = require('async'),
    fs = require('fs'),
    pathLib = require('path'),
    chalk = require('chalk');
//could also try .files[0].path (instead of .value)
var currentPath = document.getElementById('uploadFile').value;

module.exports = (firstCb) => {
    var imgId = 0;

    function iterateId(n) {
        imgId = imgId + n;
    }
    //1A. (on installation/first click) retrieve all the html files from the files
    function getAllPages(getAllPagesCb) {
        var htmlFiles = fs.readdirSync(currentPath)
            .filter(function (file) {
                return file.includes('.html');
            })
            .map(function (file) {
                return {
                    file: file,
                    contents: fs.readFileSync(file, 'utf8')
                };
            });
        getAllPagesCb(null, htmlFiles);
    }

    //1B. (on installation/first click) once all images are retrieved, turn them into objects.
    function pagesToImageObjs(htmlFiles, pagesToImgObjCb) {
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
                    //push each image obj to later match it
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
        pagesToImgObjCb(null, htmlFiles, alts.noAltImgs, alts.imgIds);
    }
    async.waterfall([getAllPages, pagesToImageObjs], function (err, pages) {
        //not sure how to handle this, noAltImgs needs to be passed to the finalCb
        firstCb(null, pages);
    });
};