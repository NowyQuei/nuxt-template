// @ts-check
import withNuxt from '.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    rules: {
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/no-explicit-any': 'off',
      'no-duplicate-imports': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'vue/no-deprecated-slot-attribute': ['off'],
      'vue/multi-word-component-names': ['off'],
      '@typescript-eslint/array-type': ['error', { default: 'array' }], // see SPARTANS-869
      'no-undef': 'off', // Already handled by typescript, see https://github.com/unplugin/unplugin-auto-import?tab=readme-ov-file#eslint
      'no-inner-declarations': 'error',
      'no-template-curly-in-string': 'error',
      'no-lonely-if': 'error',
      'no-else-return': 'error',
      'object-shorthand': 'error',
      'no-use-before-define': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/no-non-null-assertion': ['error']
    }
  },
  {
    ignores: ['.nuxt', 'node_modules']
  }
)
