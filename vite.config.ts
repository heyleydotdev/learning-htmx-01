import path from "path"

import build from "@hono/vite-build/cloudflare-pages"
import devServer from "@hono/vite-dev-server"
import adapter from "@hono/vite-dev-server/cloudflare"
import inject from "@rollup/plugin-inject"
import { defineConfig, PluginOption } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig(({ mode }) => {
  const mainEntry = path.resolve(__dirname, "src/client.ts")
  const globalsCss = path.resolve(__dirname, "src/assets/styles/globals.css")

  const globalPlugins: PluginOption[] = [
    tsconfigPaths(),
    inject({
      htmx: "htmx.org/dist/htmx.esm",
      Snackbar: "node-snackbar/dist/snackbar",
      NProgress: "nprogress/nprogress.js",
      exclude: ["**/*.css", "**/*.css?direct"],
    }),
  ]

  if (mode === "client") {
    return {
      build: {
        rollupOptions: {
          input: [mainEntry, globalsCss],
          output: {
            entryFileNames: "static/client.js",
            assetFileNames: "static/assets/[name].[ext]",
            chunkFileNames: "static/assets/[name]-[hash].js",
            manualChunks: manualChunks,
          },
        },
        manifest: true,
        emptyOutDir: false,
        copyPublicDir: false,
      },
      plugins: globalPlugins,
    }
  } else {
    return {
      plugins: [
        build(),
        devServer({
          adapter,
          entry: "src/index.tsx",
        }),
        ...globalPlugins,
      ],
    }
  }
})

function manualChunks(id: string) {
  if (id.match(/node_modules\/node-snackbar\/dist/)) {
    return "snackbar"
  }
  if (id.match(/node_modules\/nprogress/)) {
    return "nprogress"
  }
}
