/*eslint-env node*/
/*eslint no-unused-vars:1*/
/*eslint no-undef:1*/
const path = require('path'),
    url = require('url'),
    {
        app,
        BrowserWindow
    } = require('electron');

function createWindow() {
    var window = new BrowserWindow({
        width: 1100,
        height: 850
    });
    window.loadURL(url.format({
        pathname: path.join('.', 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
}
app.on('ready', createWindow);