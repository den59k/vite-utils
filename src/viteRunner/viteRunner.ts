#!/usr/bin/env node
import { createServer, loadEnv } from "vite"
import { ViteNodeRunner } from "vite-node/client"
import { createHotContext, handleMessage, viteNodeHmrPlugin } from "vite-node/hmr"
import { ViteNodeServer } from "vite-node/server"
import { installSourcemapsSupport } from "vite-node/source-map"
import { useEventListener } from "../fastifyRunner/useEventListener"
import { exec } from "child_process"

const watchIgnore = [ "**/node_modules/**", "**/.git/**", "**/dist/**", "**/temp/**", "**/uploads/**", "**/codebase/**" ]

const startMain = async () => {

  const server = await createServer({
    configFile: "vite.backend.config.ts",
    optimizeDeps: { noDiscovery: true, include: [] },
    mode: "development",
    server: {
      hmr: true,
      watch: {
        ignored: watchIgnore
      }
    },
    plugins: [
      viteNodeHmrPlugin()
    ]
  })

  await server.pluginContainer.buildStart({})
  const node = new ViteNodeServer(server)
  installSourcemapsSupport({
    getSourceMap: source => node.getSourceMap(source),
  })

  const path = "./src/backend/index.ts"

  const runner = new ViteNodeRunner({
    root: server.config.root,
    base: server.config.base,
    fetchModule(id) {
      return node.fetchModule(id)
    },
    resolveId(id, importer) {
      return node.resolveId(id, importer)
    },
    createHotContext(runner, url) {
      return createHotContext(runner, server.emitter, [path], url)
    },
  })

  server.emitter?.on('message', async (payload) => {
    await handleMessage(runner, server.emitter, [path], payload)
  })

  await runner.executeFile(path)
  return server
}

const init = async () => {

  const env = loadEnv("development", process.cwd(), 'VITE')
  const renderer = await createServer({
    configFile: "vite.frontend.config.ts"
  })
  Object.assign(renderer.config.env, env)

  console.clear()

  const frontendServer = await renderer.listen()

  await startMain()
  await new Promise(res => setTimeout(res, 0))
  process.stdout.write("App successfull launched!✨\n\n")
  frontendServer.printUrls()

  process.stdout.write("\x1b[32m")
  process.stdout.write("Use 'r' to restart app\n")
  process.stdout.write("Use 'o' to open browser page\n")
  process.stdout.write("Use 'q' to quit\n")
  process.stdout.write("\x1b[0m")

  useEventListener([ "o", "щ" ], () => {
    frontendServer.openBrowser()
  })
  
  useEventListener([ "q", "й" ], () => {
    process.exit()
  })
}
init()