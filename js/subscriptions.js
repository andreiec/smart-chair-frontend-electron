const mqtt = require('mqtt')
const shutdown = require('electron-shutdown-command')
const Swal = require('sweetalert2')

const options = {
    // Clean session
    clean: true,
    connectTimeout: 4000,
    // Auth
    clientId: '',
    username: '',
    password: '',
}

const room_temperature_value = document.getElementById("biometrics-value-roomtemperature")

const seat_value = document.getElementById("left-panel-seat-heating-value")
const backrest_value = document.getElementById("left-panel-backrest-heating-value")
const headrest_value = document.getElementById("left-panel-headrest-heating-value")
const armrest_value = document.getElementById("left-panel-armrest-heating-value")

const client  = mqtt.connect('mqtt://127.0.0.1:1883', options)

// Toggle buttons
const lock_toggle = document.getElementById("lock-toggle")

// TODO Get state from user preferences and change button state
let lock_toggle_state = false


lock_toggle.addEventListener("click", () =>{
    lock_toggle.classList.toggle("active")

    if (lock_toggle.classList.contains("active")) {
        lock_toggle_state = true
    } else {
        lock_toggle_state = false
    }
})


client.on('connect', function () {
    console.log('Connected to mqtt broker!')
    client.subscribe('scaun/incalzire', function (err) {
        if (!err) {
            console.log("Subscribed to topic: scaun/incalzire")
        }
    })

    client.subscribe('scaun/user_asezat', function (err) {
        if (!err) {
            console.log("Subscribed to topic: scaun/user_asezat")
        }
    })

    client.subscribe('stat_pe_scaun', function (err) {
        if (!err) {
            console.log("Subscribed to topic: stat_pe_scaun")
        }
    })

    client.subscribe('camera/temperatura', function (err) {
        if (!err) {
            console.log("Subscribed to topic: camera/temperatura")
        }
    })
})


client.on('reconnect', function () {
    console.log('Reconnecting...')
})


client.on('message', function (topic, message) {
    if (topic == "camera/temperatura") {
        room_temperature_value.innerText = message + "°C"
    }

    else if (topic == "scaun/user_asezat") {
        if (lock_toggle_state && message == "False") {
            console.log("Logged off!")
            //shutdown.logoff()
        }
    }

    else if (topic == "stat_pe_scaun") {
        Swal.fire({
            title: 'Sitting for too much time!',
            text: 'Get up and do some exercise.',
            icon: 'warning',
            confirmButtonText: 'Yes'
        })
    }

    else if (topic == "scaun/incalzire") {
        let heating_data = JSON.parse(message)

        if (heating_data['sezut']) {
            seat_value.innerText = "Seat heating: ON"
        } else {
            seat_value.innerText = "Seat heating: OFF"
        }

        if (heating_data['spatar']) {
            backrest_value.innerText = "Backrest heating: ON"
        } else {
            backrest_value.innerText = "Backrest heating: OFF"
        }

        if (heating_data['headrest']) {
            headrest_value.innerText = "Headrest heating: ON"
        } else {
            headrest_value.innerText = "Headrest heating: OFF"
        }

        if (heating_data['armrest']) {
            armrest_value.innerText = "Armrest heating: ON"
        } else {
            armrest_value.innerText = "Armrest heating: OFF"
        }
    }

})