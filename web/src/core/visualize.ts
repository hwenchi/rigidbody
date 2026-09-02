import * as THREE from "three";
import { RigidBodyState, RigidBodyParams, bodyAngularVelocity } from "./RigidBody.js";

export interface StateArrows {
	omega: THREE.ArrowHelper;
	L: THREE.ArrowHelper;
}

/** Arrows for a rigid body's angular velocity (orange) and angular momentum (teal), in world frame. */
export function createStateArrows(scene: THREE.Scene): StateArrows {
	const omega = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 1, 0xffaa00);
	const L = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 1, 0x00e5c8);
	scene.add(omega, L);
	return { omega, L };
}

export function updateStateArrows(
	arrows: StateArrows,
	state: RigidBodyState,
	params: RigidBodyParams,
	scale = 0.4,
): void {
	const omegaWorld = bodyAngularVelocity(state, params).clone().applyQuaternion(state.q);
	pointArrow(arrows.omega, state.X, omegaWorld, scale);
	pointArrow(arrows.L, state.X, state.L, scale);
}

function pointArrow(arrow: THREE.ArrowHelper, origin: THREE.Vector3, v: THREE.Vector3, scale: number): void {
	const len = v.length() * scale;
	arrow.position.copy(origin);
	arrow.visible = len > 1e-6;
	arrow.setDirection(v.clone().normalize());
	arrow.setLength(len);
}
