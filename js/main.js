const electron = require('electron');
var request = require('electron-request');

import { HOST } from "../variables.js";
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


// Promise for user weight
const getWeightPromise = new Promise(function(resolve, reject) {
    void (async () => {
        const url = HOST + '/weight/measure';
        const defaultOptions = { method: 'GET' };
    
        const response = await request(url, defaultOptions);
        const response_json = await response.json();
        
        if (response_json) { resolve(response_json) } else {
            reject(response)
        }
    })();
})

// Promise for user info
const getUserInfoPromise = new Promise(function(resolve, reject) {
    void (async () => {
        const url = HOST + '/userInfo';
        const defaultOptions = { method: 'GET' };

        const response = await request(url, defaultOptions);
        const response_json = await response.json();

        if (response_json) { resolve(response_json) } else {
            reject(response)
        }
    })();
})


// Buttons and increments for user height
const user_height_plus = document.getElementById("user-height-plus")
const user_height_minus = document.getElementById("user-height-minus")
const user_height_value = document.getElementById("user-height-value")

const chair_height_value = document.getElementById("biometrics-value-chairheight")
const desk_height_value = document.getElementById("biometrics-value-deskheight")

// TODO more heatings for chair
const chair_heating_plus = document.getElementById("chair-heating-plus")
const chair_heating_minus = document.getElementById("chair-heating-minus")
const chair_heating_value = document.getElementById("chair-heating-value")


// Declare user info values and biometrics
let user_height_value_content 
let chair_height_value_content
let desk_height_value_content


// Initial user_height_value_content, used to check availability of the save button
let user_height_value_content_initial

// Execute promises (weight promise)
getWeightPromise.then(function whenOk(response) {
    const biometrics_weight = document.getElementById("biometrics-value-weight")
    biometrics_weight.textContent = response['weight']
}).catch(function notOk(response) {
    console.log("Error in promise " + response)
})

// Execute promises (userInfo promise)
getUserInfoPromise.then(function whenOk(response) {

    if (response['message']) {
        // No data in db, POST default values
        void (async () => {
            const url = HOST + '/userInfo';
            const defaultOptions = { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({user_height: 175})};

            const response_2 = await request(url, defaultOptions);
            let response_2_json = await response_2.json()
            
            // This should run only once ever (first time opening the app)
            if (response_2_json['message'] == "Setari actualizate cu succes") { 
                // POST Request success, set default values
                console.log("SETTING DEFAULT VALUES - FIRST TIME RUNNING APP")

                user_height_value_content = 175
                chair_height_value_content = 46.2
                desk_height_value_content = 114.2
                
                user_height_value_content_initial = user_height_value_content

                // Set values from db (or default if not found in db)
                user_height_value.textContent = user_height_value_content
                chair_height_value.textContent = chair_height_value_content
                desk_height_value.textContent = desk_height_value_content
            } else {
                console.log('FAILED TO POST')
                console.log(response_2_json)
            }
        })();
    } else {
        // Data exists already in db, update values
        console.log("GETTING VALUES FROM DB")

        user_height_value_content = response['user_height']
        chair_height_value_content = response['chair_height']
        desk_height_value_content = response['desk_height']

        user_height_value_content_initial = user_height_value_content

        // Set values from db (or default if not found in db)
        user_height_value.textContent = user_height_value_content
        chair_height_value.textContent = chair_height_value_content
        desk_height_value.textContent = desk_height_value_content
    }
}).catch(function notOk(response) {
    console.log("Error in promise " + response)
})

// Save and refresh buttons events
const save_button = document.getElementById("save-button")
const refresh_button = document.getElementById("refresh-button")

// Refresh button get weight
refresh_button.addEventListener("click", () => {
    // Promise for user weight
    const getWeightPromise2 = new Promise(function(resolve, reject) {
        void (async () => {
            const url = HOST + '/weight/measure';
            const defaultOptions = { method: 'GET' };
        
            const response = await request(url, defaultOptions);
            const response_json = await response.json();
            
            if (response_json) { resolve(response_json) } else {
                reject(response)
            }
        })();
    })

    // Execute promises (weight promise)
    getWeightPromise2.then(function whenOk(response) {
        const biometrics_weight = document.getElementById("biometrics-value-weight")
        biometrics_weight.textContent = response['weight']
    }).catch(function notOk(response) {
        console.log("Error in promise " + response)
    })
})

// Fereasca sfantul si bunul Dumnezeu ce am putut face aici
save_button.addEventListener("click", () => {
    const saveUserInfoData = new Promise(function(resolve, reject) {
        void (async () => {
            const url = HOST + '/userInfo';
            const defaultOptions = { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({user_height: user_height_value_content})};

            const response_2 = await request(url, defaultOptions);
            let response_2_json = await response_2.json()
            
            if (response_2_json['message'] == "Setari actualizate cu succes") {
                resolve(response_2_json)
            } else {
                reject(response_2)
            }
        })();
    })

    saveUserInfoData.then(function whenOk(response) {
        void (async () => {
            const url = HOST + '/userInfo';
            const defaultOptions = { method: 'GET' };
    
            const response2 = await request(url, defaultOptions);
            const response2_json = await response2.json();
    
            if (response2_json) { 
                user_height_value_content = response2_json['user_height']
                chair_height_value_content = response2_json['chair_height']
                desk_height_value_content = response2_json['desk_height']
        
                user_height_value_content_initial = user_height_value_content

                user_height_value.textContent = user_height_value_content
                chair_height_value.textContent = chair_height_value_content
                desk_height_value.textContent = desk_height_value_content   
            } else {
                reject(response2)
            }
        })();
    }).catch(function notOk(response) {
        console.log("Error in promise " + response)
    })
})


// Set chair heating
let chair_heating_value_content = 21
chair_heating_value.textContent = chair_heating_value_content + "°C"


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

// Chair Heating buttons
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

// Toggle buttons
const lock_toggle = document.getElementById("lock-toggle")
const welcome_toggle = document.getElementById("welcome-toggle")
const heat_toggle = document.getElementById("heat-toggle")


// TODO Get state from user preferences and change button state
let lock_toggle_state = false
let welcome_toggle_state = false
let heat_toggle_state = false


lock_toggle.addEventListener("click", () =>{
    lock_toggle.classList.toggle("active")

    if (lock_toggle.classList.contains("active")) {
        lock_toggle_state = true
    } else {
        lock_toggle_state = false
    }
})

welcome_toggle.addEventListener("click", () =>{
    welcome_toggle.classList.toggle("active")

    if (welcome_toggle.classList.contains("active")) {
        welcome_toggle_state = true
    } else {
        welcome_toggle_state = false
    }
})

heat_toggle.addEventListener("click", () =>{
    heat_toggle.classList.toggle("active")

    if (heat_toggle.classList.contains("active")) {
        heat_toggle_state = true
    } else {
        heat_toggle_state = false
    }
})
