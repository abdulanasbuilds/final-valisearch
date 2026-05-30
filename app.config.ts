import tsConfigPaths from 'vite-tsconfig-paths'

export default {
  tsr: {
    appDirectory: 'app',
  },
  vite: {
    plugins: [tsConfigPaths()],
  },
  server: {
    preset: 'cloudflare-pages',
    // Edge-compatible: no Node.js APIs in route handlers
    // Secrets accessed only in createServerFn
  },
}
