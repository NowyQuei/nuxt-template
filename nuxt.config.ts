// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  typescript: {
    strict: true
  },

  future: {
    compatibilityVersion: 4
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@nuxtjs/device',
    'dayjs-nuxt',
    'compodium',
    'nuxt-auth-utils'
  ],

  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  icon: {
    serverBundle: {
      collections: ['heroicons', 'material-symbols']
    }
  },

  fonts: {
    defaults: {
      weights: [400],
      styles: ['normal', 'italic'],
      subsets: [
        'cyrillic-ext',
        'cyrillic',
        'greek-ext',
        'greek',
        'vietnamese',
        'latin-ext',
        'latin'
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      appName: 'Nuxt Starter Template',
      auth: {
        globalMiddleware: true, // Set to true if you want auth checks everywhere
        redirect: {
          login: '/',
          logout: '/',
          home: '/'
        }
      }
    },
    session: {
      maxAge: 60 * 60 * 24 * 7, // 1 week
      name: 'kga-session',
      password: 'F!!UPsERLH7HzW2Yd!g-vDhEEybs4sXB',
      cookie: {
        sameSite: 'lax'
      }
    },
    mongodbUri: 'mongodb://localhost:27017/nuxt-template'
  },

  dayjs: {
    locales: ['de', 'en'],
    plugins: ['relativeTime', 'utc', 'timezone'],
    defaultLocale: 'de',
    defaultTimezone: 'Europe/Zurich'
  },

  ui: {
    theme: {
      colors: ['primary', 'secondary', 'info', 'success', 'warning', 'error']
    }
  },

  auth: {
    webAuthn: true
  }
})
