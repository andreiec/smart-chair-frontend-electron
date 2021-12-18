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

const user_height_plus = document.getElementById("user-height-plus")
const user_height_minus = document.getElementById("user-height-minus")
const user_height_value = document.getElementById("user-height-value")
let user_height_value_content = parseInt(document.getElementById("user-height-value").textContent)

const table_height_plus = document.getElementById("table-height-plus")
const table_height_minus = document.getElementById("table-height-minus")
const table_height_value = document.getElementById("table-height-value")
let table_height_value_content = parseInt(document.getElementById("table-height-value").textContent)

const chair_heating_plus = document.getElementById("chair-heating-plus")
const chair_heating_minus = document.getElementById("chair-heating-minus")
const chair_heating_value = document.getElementById("chair-heating-value")
let chair_heating_value_content = parseInt(document.getElementById("chair-heating-value").textContent.substring(0, 2))

// User height buttons
user_height_plus.addEventListener("click", () => {
    if (user_height_value_content < 230){
        user_height_value_content++
        user_height_value.textContent = user_height_value_content
    }
})

user_height_minus.addEventListener("click", () => {
    if (user_height_value_content > 140){
        user_height_value_content--
        user_height_value.textContent = user_height_value_content
    }
})

// Table height buttons
table_height_plus.addEventListener("click", () => {
    if (table_height_value_content < 120){
        table_height_value_content++
        table_height_value.textContent = table_height_value_content
    }
})

table_height_minus.addEventListener("click", () => {
    if (table_height_value_content > 70){
        table_height_value_content--
        table_height_value.textContent = table_height_value_content
    }
})

// Table height buttons
chair_heating_plus.addEventListener("click", () => {
    if (chair_heating_value_content < 25){
        chair_heating_value_content++
        chair_heating_value.textContent = chair_heating_value_content + "°C"
    }
})

chair_heating_minus.addEventListener("click", () => {
    if (chair_heating_value_content > 18){
        chair_heating_value_content--
        chair_heating_value.textContent = chair_heating_value_content + "°C"
    }
})