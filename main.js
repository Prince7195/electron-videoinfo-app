//handle setupevents as quickly as possible
const setupEvents = require('./installers/setupEvents')
if (setupEvents.handleSquirrelEvent()) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
}

const electron = require('electron');
const path = require('path');
const url = require('url');
const ffmpeg = require('fluent-ffmpeg');

const { app, BrowserWindow, ipcMain } = electron;

var mainWindow;

function createWindow() {

    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // mainWindow.webContents.openDevTools();

}

app.on('ready', createWindow);

ipcMain.on('video:submit', (event, path) => {
    ffmpeg.setFfprobePath("C:\\Users\\PRINCE\\AppData\\Roaming\\ffmpeg\\bin\\ffprobe.exe");
    ffmpeg.ffprobe(path, (err, metadata) => {
        mainWindow.webContents.send(
            'video:metadata',
            metadata.format.duration
        );
    });
});