export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Talk to Text - Convert audio to text, transcribe voice to text, subtitles',
    meta: [
      { charset: 'utf-8' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['element-ui/lib/theme-chalk/index.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/counters',
    '@/plugins/element-ui',
    '@/plugins/localStorage',
    '@/plugins/vue-audio-recorder',
    '@/plugins/vue-awesome',
    '@/plugins/vue-shortkey',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  env: {
    SERVER_URL: process.env.SERVER_URL,
    YM_ID: process.env.YM_ID,
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    meta: {
      nativeUI: true,
    },
    manifest: {
      short_name: 'Talks',
      file_handlers: [{
        action: '/',
        accept: {
          'audio/aac': ['.aac'],
          'audio/mpeg': ['.mp3'],
          'audio/opus': ['.opus'],
          'audio/vorbis': ['.ogg'],
          'audio/wav': ['.wav'],
        }
      }],
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^element-ui/],
  },
}
