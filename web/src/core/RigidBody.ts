import * as THREE from "three";

// Branded types: structurally identical to THREE.Vector3, but the compiler
// treats BodyVec3 and WorldVec3 as distinct types, so passing one where the
// other is expected is a compile error rather than a silent frame mixup.
export type BodyVec3 = THREE.Vector3 & { readonly __frame: "body" };
export type WorldVec3 = THREE.Vector3 & { readonly __frame: "world" };

export function asBody(v: THREE.Vector3): BodyVec3 {
	return v as BodyVec3;
}
export function asWorld(v: THREE.Vector3): WorldVec3 {
	return v as WorldVec3;
}

export class RigidBodyParams {
	readonly IbodyInv: THREE.Matrix3;

	constructor(
		readonly mass: number,
		readonly Ibody: THREE.Matrix3,
	) {
		this.IbodyInv = Ibody.clone().invert();
	}
}

export class RigidBodyState {
	constructor(
		public X: WorldVec3,
		public q: THREE.Quaternion,
		public P: WorldVec3,
		public L: WorldVec3,
	) {}
}

/** omega_body = I_body^{-1} (R^T L), recovered from the state rather than stored. */
export function bodyAngularVelocity(state: RigidBodyState, params: RigidBodyParams): BodyVec3 {
	const Lbody = state.L.clone().applyQuaternion(state.q.clone().conjugate());
	return asBody(Lbody.applyMatrix3(params.IbodyInv));
}

/**
 * One integrator step. Momenta/position: plain vector-space Euler update.
 * Orientation: exponential-map update, exact on the unit-quaternion manifold
 * regardless of step size (see the Pluto notebook derivation).
 */
export function step(
	state: RigidBodyState,
	params: RigidBodyParams,
	F: WorldVec3,
	tau: WorldVec3,
	dt: number,
): void {
	state.P.addScaledVector(F, dt);
	state.L.addScaledVector(tau, dt);
	state.X.addScaledVector(state.P, dt / params.mass);

	const omegaBody = bodyAngularVelocity(state, params);
	const theta = omegaBody.length() * dt;
	if (theta > 0) {
		const axis = omegaBody.clone().normalize();
		const dq = new THREE.Quaternion().setFromAxisAngle(axis, theta);
		state.q.multiply(dq); // right-multiply: correct because omegaBody is body-frame
	}
}

/** Kinetic energy: 0.5 * omega_body^T I_body omega_body + 0.5 |P|^2 / mass. Useful as an integrator sanity check. */
export function kineticEnergy(state: RigidBodyState, params: RigidBodyParams): number {
	const omegaBody = bodyAngularVelocity(state, params);
	const Iomega = omegaBody.clone().applyMatrix3(params.Ibody);
	const rotational = 0.5 * omegaBody.dot(Iomega);
	const translational = 0.5 * state.P.lengthSq() / params.mass;
	return rotational + translational;
}
