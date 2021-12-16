const electron = require('electron')

const { app, BrowserWindow, Menu } = electron;

let mainWindow

app.on('ready', () => {
    mainWindow = new BrowserWindow({ width: 1280, height: 898, autoHideMenuBar: true, resizable: false })
    mainWindow.loadFile('main.html')
})
