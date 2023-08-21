import { appTools, defineConfig } from '@modern-js/app-tools';
import { isDev } from './src/utils';

// https://modernjs.dev/en/configure/app/usage
export default defineConfig<'rspack'>({
  runtime: {
    router: {
      supportHtml5History: isDev
    }
  },
  output: {
    assetPrefix: isDev ? undefined : './',
    polyfill: 'off',
    disableTsChecker: true,
    splitRouteChunks: false,
    disableSourceMap: !isDev,
    distPath: { html: '' }
  },
  dev: {
    startUrl: true
  },
  performance: {
    chunkSplit: { strategy: 'all-in-one' }
  },
  html: {
    title: 'React18',
    disableHtmlFolder: true,
    favicon: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/uhbfnupenuhf/favicon.ico'
  },
  source: {
    mainEntryName: 'index'
  },
  plugins: [appTools({ bundler: 'experimental-rspack' })]
});
