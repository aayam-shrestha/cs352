import './style.css'
import * as THREE from 'three';
import { OrbitControls } from './OrbitControls';

// Setup

const scene = new THREE.Scene();
scene.position.x = 0;
scene.position.y = 0;
scene.position.z = 0;

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 10000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(0, 20, 130);
camera.lookAt(0, 0, 0);

// Setting up trackball controls

const controls = new OrbitControls(camera, renderer.domElement);
controls.target = new THREE.Vector3(0, 0, 0);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI / 2;

// Stem

const geometry = new THREE.CylinderGeometry(0.5, 1, 27, 10);
const material = new THREE.MeshLambertMaterial({ color: 0x3cc95d });
const cylinder = new THREE.Mesh(geometry, material);

scene.add(cylinder);

// Branches
const branchGeometry = new THREE.CylinderGeometry(0.3, 0.6, 7, 10)
const branchMaterial = new THREE.MeshLambertMaterial({ color: 0x3cc95d });
const branch1 = new THREE.Mesh(branchGeometry, branchMaterial)
branch1.rotateX(Math.PI / 2.5);
branch1.position.setZ(3);
cylinder.add(branch1);

const branch2 = new THREE.Mesh(branchGeometry, branchMaterial);
branch2.position.setY(3);
branch2.position.setZ(-3);
branch2.rotateX(-Math.PI / 2.5);
branch2.rotateY(-Math.PI / 2.5);
cylinder.add(branch2);

// Yellow part of the flower
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1.2, 8, 8),
  new THREE.MeshLambertMaterial({ color: 0xebe834 })
)
sphere.position.setY(12.5)
cylinder.add(sphere);

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(15, 15, 15);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(pointLight, ambientLight);

// Helpers
// const axesHelper = new THREE.AxesHelper(100);
// const lightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(200, 50);
// gridHelper.position.x = 0;
// gridHelper.position.y = 0;
// gridHelper.position.z = 0;
// scene.add(lightHelper, gridHelper, axesHelper);

// Petals

// function that randomly generates petals
function createPetal() {
  const geometry = new THREE.CircleGeometry(10, 15, 0, Math.PI / 2.5);
  const material = new THREE.MeshStandardMaterial({ color: 0xcc0033 });

  // disabling backface culling for petals
  material.side = THREE.DoubleSide;

  const petal = new THREE.Mesh(geometry, material);
  petal.rotateX(-Math.PI / 2);
  petal.rotateZ(Math.random() * Math.PI * 2);
  petal.rotateY(-Math.random() / 3);
  petal.position.setY(12);

  cylinder.add(petal);
}

// calling the createPetal function for each element in the array
Array(45).fill().forEach(createPetal)

// Background
const skyTexture = new THREE.TextureLoader().load('images/sky.jpg');
scene.background = skyTexture;

// Plane
const soilTexture = new THREE.TextureLoader().load('images/soil.jpg');

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(700, 700, 50, 50),
  new THREE.MeshBasicMaterial({ map: soilTexture })
)
plane.rotateX(- Math.PI / 2);
plane.position.setY(-12);
cylinder.add(plane);

// Animation
function animate() {
  requestAnimationFrame(animate);
  cylinder.rotation.y += 0.003;
  controls.update();
  renderer.render(scene, camera);
}

animate();