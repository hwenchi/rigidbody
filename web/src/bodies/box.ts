import * as THREE from "three";

/** Principal moments of inertia for a uniform rectangular box (a x b x c), about its center of mass. */
export function boxInertia(mass: number, a: number, b: number, c: number): THREE.Matrix3 {
	const I1 = (mass / 12) * (b * b + c * c);
	const I2 = (mass / 12) * (a * a + c * c);
	const I3 = (mass / 12) * (a * a + b * b);
	return new THREE.Matrix3().set(
		I1, 0, 0,
		0, I2, 0,
		0, 0, I3,
	);
}
