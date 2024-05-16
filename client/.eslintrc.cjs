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
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: ['react'],
  ignorePatterns: [
    '.eslintrc.cjs',
    'vite.config.ts',
    'prettier.config.js',
    'public/svg/*',
  ],
  rules: {
    '@typescript-eslint/comma-dangle': 'off',
    'react/react-in-jsx-scope': 'off',
    'multiline-ternary': 'off',
    '@typescript-eslint/semi': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/triple-slash-reference': 'off',
    '@typescript-eslint/consistent-type-imports': 'off',
    '@typescript-eslint/dot-notation': 'off',
    '@typescript-eslint/return-await': 'off',
    '@typescript-eslint/promise-function-async': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/member-delimiter-style': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-confusing-void-expression': 'off',
    'prefer-regex-literals': 'off',
  },
};
