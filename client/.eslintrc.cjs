module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['standard-with-typescript', 'plugin:react/recommended'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}', 'vite.config.ts'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: '@typescript-eslint/parser',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['react'],
  ignorePatterns: ['.eslintrc.cjs', 'vite.config.ts'],
  rules: {
    '@typescript-eslint/comma-dangle': 'off',
    'react/react-in-jsx-scope': 'off',
  },
}
