import { Scene, PerspectiveCamera, WebGLRenderer, AxesHelper, HemisphereLight, ReinhardToneMapping, Vector3 } from './three.module.js';
import { GLTFLoader } from './GLTFLoader.js';
import { OrbitControls } from './OrbitControls.js';


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