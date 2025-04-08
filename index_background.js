import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );
renderer.setAnimationLoop(animate);

const light = new THREE.SpotLight( 0xfffffff, 10000000, 10000, 60);
const light2 = new THREE.SpotLight( 0xfffffff, 10000000, 10000, 180);
light.position.set( 600, 700, 800 );
light2.position.set( 600, 700, -800 );
scene.add( light );
scene.add( light2 );

const loader = new GLTFLoader();

loader.load( 'assets/earth_cartoon/scene.gltf', function ( gltf ) {

    let object = gltf.scene;
    object.name = "planet";

	scene.add( object );

}, undefined, function ( error ) {

	console.error( error );

} );

const controls = new OrbitControls(camera, renderer.domElement);
controls.listenToKeyEvents( window );

//scene.add(cube);

camera.position.z = 3;

controls.target.set(0, 0, 0);
controls.update();

controls.mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.PAN
};

function animate() {
    controls.update()
	render();
}

function render() {
    renderer.render( scene, camera );
}
