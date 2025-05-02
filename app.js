import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'https://cdn.skypack.dev/gsap';

// === Scene Setup ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  10,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 13;

let bee;
let mixer;

// === Load Model ===
const loader = new GLTFLoader();
loader.load(
  '/demon_bee_full_texture.glb',
  function (gltf) {
    bee = gltf.scene;
    scene.add(bee);

    mixer = new THREE.AnimationMixer(bee);
    mixer.clipAction(gltf.animations[0]).play();
    modelMove(); // Initial position
  },
  undefined,
  function (error) {
    console.error('An error occurred while loading the model:', error);
  }
);

// === Renderer ===
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container3D').appendChild(renderer.domElement);

// === Lighting ===
const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(ambientLight, directionalLight);

// === Resize Handling ===
function adjustCameraForScreen() {
  const isMobile = window.innerWidth < 768;
  camera.position.set(0, 0, isMobile ? 18 : 14); // Adjusted camera Z for mobile
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.updateProjectionMatrix();
  adjustCameraForScreen();
});

adjustCameraForScreen(); // Initial run

// === Animation Loop ===
const renderer3D = () => {
  requestAnimationFrame(renderer3D);
  renderer.render(scene, camera);
  if (mixer) mixer.update(0.02);
};
renderer3D();

// === Responsive Position Data ===
function getResponsivePositions() {
  const isMobile = window.innerWidth < 768;
  if (isMobile) {
    return [
      {
        id: 'banner',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 1.5, z: 0 },
      },
      {
        id: 'intro',
        position: { x: 0.2, y: -1, z: -4 },
        rotation: { x: 0.3, y: -0.3, z: 0 },
      },
      {
        id: 'description',
        position: { x: -0.2, y: -1.2, z: -4 },
        rotation: { x: 0, y: 0.6, z: 0 },
      },
      {
        id: 'contact',
        position: { x: 0.3, y: -1, z: 0 },
        rotation: { x: 0.2, y: -0.3, z: 0 },
      },
    ];
  } else {
    return [
      {
        id: 'banner',
        position: { x: 0, y: -1, z: 0 },
        rotation: { x: 0, y: 1.5, z: 0 },
      },
      {
        id: 'intro',
        position: { x: 1, y: -1, z: -5 },
        rotation: { x: 0.5, y: -0.5, z: 0 },
      },
      {
        id: 'description',
        position: { x: -1, y: -1, z: -5 },
        rotation: { x: 0, y: 0.5, z: 0 },
      },
      {
        id: 'contact',
        position: { x: 0.8, y: -1, z: 0 },
        rotation: { x: 0.3, y: -0.5, z: 0 },
      },
    ];
  }
}

// === Scroll-Based Model Movement ===
const modelMove = () => {
  const sections = document.querySelectorAll('.section');
  let currentSection;
  sections.forEach((section) => {
    const pos = section.getBoundingClientRect();
    if (pos.top <= window.innerHeight / 3) {
      currentSection = section.id;
    }
  });

  const positions = getResponsivePositions();
  const activeIndex = positions.findIndex((pos) => pos.id === currentSection);

  if (activeIndex >= 0 && bee) {
    const newPos = positions[activeIndex];

    gsap.to(bee.position, {
      x: newPos.position.x,
      y: newPos.position.y,
      z: newPos.position.z,
      duration: 3,
      ease: 'power1.out',
    });

    gsap.to(bee.rotation, {
      x: newPos.rotation.x,
      y: newPos.rotation.y,
      z: newPos.rotation.z,
      duration: 3,
      ease: 'power1.out',
    });
  }
};

window.addEventListener('scroll', () => {
  if (bee) modelMove();
});
