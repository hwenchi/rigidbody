import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Pane } from "tweakpane";
import { step, asWorld, kineticEnergy } from "./core/RigidBody.js";
import { createStateArrows, updateStateArrows } from "./core/visualize.js";
import { createTumblingBoxScene, resetTumblingBox } from "./scenes/tumblingBox.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(
	50,
	window.innerWidth / window.innerHeight,
	0.1,
	100,
);
camera.position.set(4.5, 4.5, 7.5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
dirLight.position.set(3, 5, 2);
scene.add(dirLight);
scene.add(new THREE.AxesHelper(2));

const guiParams = { omegaX: 0.01, omegaY: 5.0, omegaZ: 0.01, playing: true };
const monitorParams = { energy: 0, P: 0, L: 0 };
const box = createTumblingBoxScene(scene, new THREE.Vector3(guiParams.omegaX, guiParams.omegaY, guiParams.omegaZ));
const arrows = createStateArrows(scene);
const zero = asWorld(new THREE.Vector3(0, 0, 0));
const dt = 1 / 120;

function currentOmega0(): THREE.Vector3 {
	return new THREE.Vector3(guiParams.omegaX, guiParams.omegaY, guiParams.omegaZ);
}

function setPlaying(value: boolean): void {
	guiParams.playing = value;
	playButton.title = value ? "Pause" : "Play";
}

function pauseAndReset(): void {
	setPlaying(false);
	resetTumblingBox(box, currentOmega0());
}

const pane = new Pane({ title: "Tumbling Box" });
const omegaFolder = pane.addFolder({ title: "Initial angular velocity (body frame)" });
const omegaXBinding = omegaFolder.addBinding(guiParams, "omegaX", { min: -8, max: 8, label: "x" });
const omegaYBinding = omegaFolder.addBinding(guiParams, "omegaY", { min: -8, max: 8, label: "y" });
const omegaZBinding = omegaFolder.addBinding(guiParams, "omegaZ", { min: -8, max: 8, label: "z" });
omegaXBinding.on("change", pauseAndReset);
omegaYBinding.on("change", pauseAndReset);
omegaZBinding.on("change", pauseAndReset);
const playButton = pane.addButton({ title: guiParams.playing ? "Pause" : "Play" });
playButton.on("click", () => setPlaying(!guiParams.playing));
pane.addButton({ title: "Reset" }).on("click", pauseAndReset);

const monitorContainer = document.createElement("div");
monitorContainer.style.position = "fixed";
monitorContainer.style.top = "8px";
monitorContainer.style.left = "8px";
document.body.appendChild(monitorContainer);

const monitorPane = new Pane({ title: "Monitors", container: monitorContainer });
monitorPane.addBinding(monitorParams, "energy", { readonly: true, view: "graph", min: 0, max: 15, label: "energy" });
monitorPane.addBinding(monitorParams, "P", { readonly: true, view: "graph", min: 0, max: 2, label: "momentum" });
monitorPane.addBinding(monitorParams, "L", { readonly: true, view: "graph", min: 0, max: 6, label: "angular momentum" });

window.addEventListener("resize", () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate(): void {
	requestAnimationFrame(animate);
	if (guiParams.playing) {
		step(box.state, box.params, zero, zero, dt);
	}
	box.mesh.quaternion.copy(box.state.q);
	box.mesh.position.copy(box.state.X);
	updateStateArrows(arrows, box.state, box.params);
	monitorParams.energy = kineticEnergy(box.state, box.params);
	monitorParams.P = box.state.P.length();
	monitorParams.L = box.state.L.length();
	controls.update();
	renderer.render(scene, camera);
}
animate();
