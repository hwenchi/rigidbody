import * as THREE from "three";
import { RigidBodyParams, RigidBodyState, asWorld } from "../core/RigidBody.js";
import { boxInertia } from "../bodies/box.js";

export interface TumblingBoxScene {
	params: RigidBodyParams;
	state: RigidBodyState;
	mesh: THREE.Mesh;
}

/**
 * Torque-free tumbling box, spun mostly about its intermediate principal
 * axis (unstable, per the intermediate-axis theorem) with a small
 * perturbation to seed the instability. Same setup as the Pluto notebook.
 * I1=(b^2+c^2)/12 largest, I2=(a^2+c^2)/12 intermediate, I3=(a^2+b^2)/12 smallest.
 */
export function createTumblingBoxScene(scene: THREE.Scene, omega0: THREE.Vector3): TumblingBoxScene {
	const [a, b, c] = [1, 2, 3];
	const params = new RigidBodyParams(1.0, boxInertia(1.0, a, b, c));
	const state = initialState(params, omega0);

	const mesh = new THREE.Mesh(
		new THREE.BoxGeometry(a, b, c),
		new THREE.MeshStandardMaterial({ color: 0x4a90d9, transparent: true, opacity: 0.4 }),
	);
	scene.add(mesh);

	return { params, state, mesh };
}

function initialState(params: RigidBodyParams, omega0: THREE.Vector3): RigidBodyState {
	// body frame == world frame at q=identity
	const L0 = asWorld(omega0.clone().applyMatrix3(params.Ibody));
	return new RigidBodyState(
		asWorld(new THREE.Vector3(0, 0, 0)),
		new THREE.Quaternion(),
		asWorld(new THREE.Vector3(0, 0, 0)),
		L0,
	);
}

/** Re-initialize in place (same params, same mesh) with a new initial angular velocity. */
export function resetTumblingBox(box: TumblingBoxScene, omega0: THREE.Vector3): void {
	const fresh = initialState(box.params, omega0);
	box.state.X.copy(fresh.X);
	box.state.q.copy(fresh.q);
	box.state.P.copy(fresh.P);
	box.state.L.copy(fresh.L);
}
