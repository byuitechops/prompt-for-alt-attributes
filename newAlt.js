#!/usr/bin / env node

/*eslint-env node, es6*/
var cheerio = require('cheerio'),
    asyncLib = require('async'),
    fs = require('fs'),
    pathLib = require('path'),
    currentPath = pathLib.resolve('.'),
    chalk = require('chalk'),
    injectHtml = require('./injectHtml.js');

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
                //somehow the contents are getting printed??
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


//2. After all images are retrieved, inject each image into the html page.
function injectImages(pages, noAltImgs, imageIDs, injectCB) {
    //inject image 
    noAltImgs.forEach(function (image) {
        document.innerHTML = injectHtml(image.imageFile, image.source, image.imgId);
        //this returns the index # 
        var equalIds = imageIDs.find((i) => {
            return image.imgId === i;
        });
        if (equalIds) {
            getChanges(image);
        }
    });

    function getChanges(image) {
        //var inputBox = ('input') << cheerio?
        //grab the text from the input box
        //stuff that was in the last function...not sure if this is helpful for the new thing
        /* noAltImgs.forEach(function (image, i) {
            image.alt = results['alt' + i];
        }); */
        image.alt === '';
    }

    injectCB(null, pages, noAltImgs);
}




//3.After button is selected, use this function to change the pages based on the last function
//make the changes to the html from alt on noAltImgs[i]
function changeAltsHtml(pages, newAltImgs, changeAltsHtmlCb) {
    pages.forEach(function (page) {
        //images from the page object mapped previously
        page.images.forEach(function (image) {
            image = page.dom(image);
            var src = image.attr('src');
            image.source = pathLib.basename(src);
            var oldSrc = image.source;
            //check the source attr against the obj in the newAltImgs array in order to match them
            newAltImgs.forEach(function (newAltImage) {
                var newSrc = pathLib.basename(newAltImage.source);
                if (newSrc === oldSrc) {
                    //console.log(chalk.bgGreen('MATCH ' + newAltImage.imageFile));
                    changeAlt(image, newAltImage.alt);
                }
            });
        });
        page.html = page.dom.html();
        //could take the dom out since you're already saving it 
    });
    //helper function to change the alt text
    function changeAlt(image, newAlt) {
        image.attr('alt', newAlt);
    }

    changeAltsHtmlCb(null, pages);
}

var functions = [getAllPages, pagesToImageObjs, injectImages, changeAltsHtml];

asyncLib.waterfall(functions, function (err, pages) {
    if (err) {
        //console.log(err);
        return;
    }
    var timestamp = Date.now(),
        //instead of  using timestamp, use fs.readlinkSync to name it the same as the course w/the extra word 'new' or something
        newPath = pathLib.resolve(currentPath, 'updatedFiles ' + timestamp);
    fs.mkdirSync(newPath);
    pages.forEach(function (page) {
        var parsedPath = pathLib.parse(page.file),
            fileName = parsedPath.name + parsedPath.ext,
            path = pathLib.join(newPath, fileName);
        fs.writeFileSync(path, page.html);
    });
    console.log(chalk.cyan('PROCESS COMPLETE! Find the updated files in: ' + newPath));
});
/* var userPath = document.getElementById('uploadFile').files[0].path
        console.log('user path: ' + userPath);

        // Is this where I 'm supposed to run my files?
        var myFiles = [
            require('./make-stuff-happen/input1.js'),
            require('./make-stuff-happen/runMain2.js'),
            require('./make-stuff-happen/addAlt3.js'),
            require('./make-stuff-happen/output4.js')
        ];
        async.waterfall(myFiles, function (err, pages) {
            if (err) {
                console.log(err);
                return;
            }
        }); */