const electron = require('electron')

const { app, BrowserWindow, ipcMain } = electron

let mainWindow


app.on('ready', () => {
    mainWindow = new BrowserWindow({ 
        width: 1280, 
        height: 869, 
        autoHideMenuBar: true,
        resizable: false, 

        webPreferences: {
            nodeIntegration: true,          
            contextIsolation: false,        
            enableRemoteModule: true,       
        },
        
        frame: false
        })

    mainWindow.loadFile('main.html')
})

ipcMain.on("app/close", (evt, arg) => {
    app.quit()
})

ipcMain.on("app/minimize", (evt, arg) => {
    mainWindow.minimize()
})