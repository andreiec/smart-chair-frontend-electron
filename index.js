const electron = require('electron')

const { app, BrowserWindow, Menu } = electron;

let mainWindow


app.on('ready', () => {
    mainWindow = new BrowserWindow({ width: 1280, height: 869, autoHideMenuBar: true, resizable: false, titleBarStyle: "hidden" })
    mainWindow.loadFile('main.html')
})
