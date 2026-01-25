import { reactRouter } from "@react-router/dev/vite";
import tailwindvite from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [reactRouter(), tailwindvite(), tsconfigPaths()],
});
