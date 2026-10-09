import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";
import { htmlPlugin } from "./build/html-plugin.ts";

export default defineConfig({
  base: "/",
  plugins: [tailwindcss(), htmlPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), "index.html"),
        notFound: resolve(process.cwd(), "404.html"),
      },
    },
  },
});
