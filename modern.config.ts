import { appTools, defineConfig } from '@modern-js/app-tools'
import { isDev } from './src/utils'

// https://modernjs.dev/en/configure/app/usage
export default defineConfig({
  output: {
    assetPrefix: isDev ? undefined : './',
    polyfill: 'off',
    disableTsChecker: true,
    splitRouteChunks: false,
    distPath: { html: '' },
  },
  dev: {
    startUrl: true,
  },
  performance: {
    chunkSplit: { strategy: 'all-in-one' },
  },
  html: {
    title: 'React19',
    outputStructure: 'flat',
    favicon: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/uhbfnupenuhf/favicon.ico',
  },
  plugins: [appTools()],
})
