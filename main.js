const electron = require('electron')

const { ipcRenderer } = electron

// Title bar minimize and close logic
const closeApp = document.getElementById("close-app")
const minimizeApp = document.getElementById("minimize-app")

closeApp.addEventListener("click", () => {
    ipcRenderer.send("app/close")
});

minimizeApp.addEventListener("click", () => {
    ipcRenderer.send("app/minimize")
})


// Buttons and increments