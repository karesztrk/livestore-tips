// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 60_001,
  },
  vite: {
    worker: { format: "es" },
    optimizeDeps: {
      // TODO remove once fixed https://github.com/vitejs/vite/issues/8427
      exclude: ["@livestore/wa-sqlite"],
    },
  },
  integrations: [react()],
});
