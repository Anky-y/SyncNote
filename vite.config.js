import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import tailwindcss from "@tailwindcss/vite";
import solidSvg from "vite-plugin-solid-svg";

export default defineConfig({
  plugins: [solidPlugin(), tailwindcss(), solidSvg(), svgLoader()],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
  },
});
