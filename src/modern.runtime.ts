import { defineRuntimeConfig } from '@modern-js/runtime'
import { isDev } from './utils'

export default defineRuntimeConfig({
  router: {
    supportHtml5History: isDev,
  },
})
