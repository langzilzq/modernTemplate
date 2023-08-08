import { appTools, defineConfig } from '@modern-js/app-tools';
import { ssgPlugin } from '@modern-js/plugin-ssg';

// https://modernjs.dev/en/configure/app/usage
export default defineConfig<'rspack'>({
  runtime: {
    router: true
  },
  output: {
    ssg: true,
    polyfill: 'off',
    disableTsChecker: true,
    disableSourceMap: true,
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
  plugins: [appTools({ bundler: 'experimental-rspack' }), ssgPlugin()]
});
