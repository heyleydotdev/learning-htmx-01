import build from "@hono/vite-build/cloudflare-pages"
import devServer from "@hono/vite-dev-server"
import adapter from "@hono/vite-dev-server/cloudflare"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig(({ mode }) => {
  if (mode === "client") {
    return {
      build: {
        rollupOptions: {
          input: ["./src/client.ts", "./src/assets/styles/globals.css"],
          output: {
            entryFileNames: "static/client.js",
            assetFileNames: "static/assets/[name].[ext]",
          },
        },
        manifest: true,
        emptyOutDir: false,
        copyPublicDir: false,
      },
      plugins: [tsconfigPaths()],
    }
  } else {
    return {
      plugins: [
        build(),
        devServer({
          adapter,
          entry: "src/index.tsx",
        }),
        tsconfigPaths(),
      ],
    }
  }
})
