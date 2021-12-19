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


//
// THREE.JS RENDERING
//


// Canvas size
canvas_width = 620
canvas_height = 445

// Define scene camera and renderer
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, canvas_width / canvas_height, 0.1, 1000)
const renderer = new THREE.WebGLRenderer( {antialias: true, alpha: true } )
const canvas = document.getElementById("renderer-canvas")

renderer.setSize(canvas_width, canvas_height)

// Transparent background
renderer.setClearColor(0x000000, 0)

// Append renderer
canvas.appendChild(renderer.domElement)

// Create cube
const texture = new THREE.TextureLoader().load( 'crate.gif' );
const geometry = new THREE.BoxGeometry(2, 2, 2)
const material = new THREE.MeshBasicMaterial( {map: texture } )
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

camera.position.z = 5

// Animate cube
function animate() {
    requestAnimationFrame(animate)
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01

    renderer.render(scene, camera)
}

animate()