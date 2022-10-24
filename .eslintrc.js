module.exports = {
  parserOptions: {
    ecmaVersion: 'latest',
  },
  env: {
    es6: true,
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: ['nevermined'],
    },
  ],
}
