/*eslint-env node*/
const path = require('path'),
    url = require('url'),
    {
        app,
        BrowserWindow
    } = require('electron');

function createWindow() {
    var win = new BrowserWindow({
        width: 1400,
        height: 1100
    });
    win.loadURL(url.format({
        pathname: path.join('.', 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
}
app.on('ready', createWindow);