import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import tailwindcss from "@tailwindcss/vite";
import solidSvg from "vite-plugin-solid-svg";
import { injectManifest } from "workbox-build";

export default defineConfig({
  plugins: [
    solidPlugin(),
    tailwindcss(),
    solidSvg(),
    {
      name: "vite-plugin-workbox",
      closeBundle: async () => {
        await injectManifest({
          swSrc: "./public/service-worker.js", // Your service worker file
          swDest: "./dist/service-worker.js",
          globDirectory: "./dist",
          globPatterns: ["**/*.{html,js,css,png,svg,jpg,json, jsx, ico}"], // Automatically includes all files
        });
      },
    },
  ],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
    outDir: "dist",
  },
});
