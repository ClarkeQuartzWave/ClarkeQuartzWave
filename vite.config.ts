import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import svgrPlugin from "vite-plugin-svgr";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react(), svgrPlugin(), tailwindcss()],
	build: {
		outDir: "build",
	},
	server: {
		open: true,
		port: 3000,
	},
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: "./src/setupTests.ts",
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
