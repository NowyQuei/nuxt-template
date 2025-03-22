module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    '@nuxt/eslint-config',
    'plugin:vue/vue3-recommended',
    'plugin:nuxt/recommended',
    'eslint:recommended',
    'prettier'
  ],
  rules: {
    'no-console': 'warn',
    'vue/multi-word-component-names': 'off',
    'vue/html-self-closing': 'error',
    'vue/attribute-hyphenation': ['error', 'always'],
    'vue/html-indent': ['error', 2],
    'prettier/prettier': ['error', { singleQuote: true, semi: false }]
  }
}
