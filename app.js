import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'https://cdn.skypack.dev/gsap';

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
    10,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
)
camera.position.z = 13
let bee 
let mixer
const loader = new GLTFLoader()
loader.load('/demon_bee_full_texture.glb',
    function (gltf){
        bee = gltf.scene
        scene.add(bee)

        mixer = new THREE.AnimationMixer(bee)
        mixer.clipAction(gltf.animations[0]).play()
        modelMove()
    },
    function (xhr){},
    function (error){}
)
const renderer = new THREE.WebGLRenderer({alpha: true})
renderer.setSize(window.innerWidth, window.innerHeight)
document.getElementById('container3D').appendChild(renderer.domElement)

const ambientLight = new THREE.AmbientLight(0xffffff, 1.3)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
//directionalLight.position.set(500,500,500)
scene.add(ambientLight,directionalLight)

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})

const renderer3D = () => {
    requestAnimationFrame(renderer3D)
    renderer.render(scene,camera)
    if (mixer) mixer.update(0.02)    
}
renderer3D()

let arrPositionModel = [
    {
        id: 'banner',
        position: {x: 0, y: -1, z: 0},
        rotation: {x: 0, y: 1.5, z: 0}
    },
    {
        id: "intro",
        position: { x: 1, y: -1, z: -5 },
        rotation: { x: 0.5, y: -0.5, z: 0 },
    },
    {
        id: "description",
        position: { x: -1, y: -1, z: -5 },
        rotation: { x: 0, y: 0.5, z: 0 },
    },
    {
        id: "contact",
        position: { x: 0.8, y: -1, z: 0 },
        rotation: { x: 0.3, y: -0.5, z: 0 },
    },
];

const modelMove = () => {
    const sections = document.querySelectorAll('.section')
    let currentSection
    sections.forEach((section) =>{
        const pos = section.getBoundingClientRect()
        if (pos.top <= window.innerHeight/3)
            currentSection = section.id
    })
    let activePosition = arrPositionModel.findIndex((pos) => pos.id===currentSection)
    if (activePosition>=0){
        let newPos = arrPositionModel[activePosition]
        gsap.to(bee.position,{
            x: newPos.position.x,
            y: newPos.position.y,
            z: newPos.position.z,
            duration: 3,
            ease: 'power1.out'
        })
        gsap.to(bee.rotation, {
            x: newPos.rotation.x,
            y: newPos.rotation.y,
            z: newPos.rotation.z,
            duration: 3,
            ease: 'power1.out'
        })
    }

}

window.addEventListener('scroll',() => {
    if (bee) modelMove()
})

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.updateProjectionMatrix()
})