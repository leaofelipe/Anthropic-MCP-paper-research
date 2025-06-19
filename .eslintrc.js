module.exports = {
  extends: ['standard', 'prettier'],
  plugins: ['prettier'],
  env: {
    node: true,
    es6: true
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'script'
  },
  rules: {
    'prettier/prettier': 'error',
    'no-unsafe-optional-chaining': [
      'error',
      { disallowArithmeticOperators: true }
    ],
    camelcase: 'off'
  }
}
