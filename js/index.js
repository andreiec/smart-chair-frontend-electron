const electron = require('electron')

const { app, BrowserWindow, ipcMain } = electron

let mainWindow


app.on('ready', () => {
    mainWindow = new BrowserWindow({ 
        width: 1280, 
        height: 869, 
        autoHideMenuBar: true,
        resizable: false, 
        frame: false,
        show: false,

        webPreferences: {
            nodeIntegration: true,          
            contextIsolation: false,        
            enableRemoteModule: true,
            devTools: true,    
        },
        
    })
    
    // Open dev tools
    mainWindow.webContents.openDevTools()
    mainWindow.loadFile('main.html')
    mainWindow.on("ready-to-show", mainWindow.show)

})

ipcMain.on("app/close", (evt, arg) => {
    app.quit()
})

ipcMain.on("app/minimize", (evt, arg) => {
    mainWindow.minimize()
})