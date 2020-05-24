module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import'],
  extends: [
    'airbnb-typescript/base',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'import/prefer-default-export': 'off',
    'no-underscore-dangle': 'off',
    'class-methods-use-this': 'off',
    'no-restricted-syntax': 'off'
  },
  'settings': {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx']
      },
      'import/resolver': {
        // use <root>/tsconfig.json
        'typescript': {
          'alwaysTryTypes': true // always try to resolve types under `<roo/>@types` directory even it doesn't contain any source code, like `@types/unist`
        },
      }
  }
};
