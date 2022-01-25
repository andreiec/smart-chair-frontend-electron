const electron = require('electron');
import { Scene, PerspectiveCamera, WebGLRenderer, AxesHelper, HemisphereLight, ReinhardToneMapping, Vector3 } from './three.module.js';
import { GLTFLoader } from './GLTFLoader.js';
import { OrbitControls } from './OrbitControls.js';
import { HOST } from "../variables.js";
var request = require('electron-request')

// Title bar minimize and close logic
const closeApp = document.getElementById("close-app")
const minimizeApp = document.getElementById("minimize-app")

closeApp.addEventListener("click", () => {
    ipcRenderer.send("app/close")
});

minimizeApp.addEventListener("click", () => {
    ipcRenderer.send("app/minimize")
})

var response_text = null


// TEST PROMISE TO SET WIGHT
const getDataPromise = new Promise(function(resolve, reject) {

    void (async () => {

        const url = HOST + '/weight/measure';
    
        const defaultOptions = {
          method: 'GET',
        };
    
        const response = await request(url, defaultOptions);
        response_text = await response.text();
        
        if (response_text) {
            resolve(JSON.parse(response_text))
        }else{
            reject("NOT OK")
        }
    })();
})

getDataPromise.then(function whenOk(response) {
    const biometrics_weight = document.getElementById("biometrics-value-weight")
    biometrics_weight.textContent = response['weight']
}).catch(function notOk(response) {
    console.log("Error in promise " + response)
})

// END TEST PROMISE WORKS!!!!!!!!

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


// TODO Make requests
    user_height_value_content = 163
    user_height_value.textContent = user_height_value_content

    table_height_value_content = 81
    table_height_value.textContent = table_height_value_content

    chair_heating_value_content = 22
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


//
// THREE.JS RENDERING
//


// Canvas size
const canvas_width = 620
const canvas_height = 445

// Define scene camera and renderer
const scene = new Scene()
const camera = new PerspectiveCamera(75, canvas_width / canvas_height, 0.1, 1000)
const renderer = new WebGLRenderer( {antialias: true, alpha: true } )
const canvas = document.getElementById("renderer-canvas")

// Adding lighting
const hemiLight = new HemisphereLight(0xffeeb1, 0x080820, 7.2)
scene.add(hemiLight)


// Set renderer size and background
renderer.setSize(canvas_width, canvas_height)
renderer.setClearColor(0x000000, 0)
renderer.toneMapping = ReinhardToneMapping
renderer.toneMappingExposure = 1

// Append renderer
canvas.appendChild(renderer.domElement)

// Load chair model
const loader = new GLTFLoader()
let chair 

loader.load("./resources/models/chair.glb", result => {
    chair = result.scene
    scene.add(chair)
})


// Set camera position and add orbit controls
let controls = new OrbitControls(camera, renderer.domElement)
camera.position.set(-10, 8, 10)

// Orbit controls settings
controls.enableZoom = false
controls.autoRotate = true
controls.autoRotateSpeed = 2.25
controls.enableDamping = true
controls.enablePan = false
controls.rotateSpeed = 0.75
controls.maxPolarAngle = 1.3
controls.minPolarAngle = 1.3
controls.target = new Vector3(0, 6, 0)
controls.maxDistance = 11
controls.update()

// Debug axis
// scene.add(new AxesHelper(500))


// Update renderer
const animate = function () {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
    controls.update()
};

animate()