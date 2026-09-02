import { defineConfig } from "vite";

// Served from https://hwenchi.github.io/rigidbody/ (a project page, not a
// user/org root page), so asset URLs need this base path in production.
export default defineConfig({
	base: "/rigidbody/",
});
