// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
// import reactRecommended from 'eslint-plugin-react/configs/recommended';
import react from 'eslint-plugin-react';

export default tseslint.config({
  extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
  plugins: {
    '@typescript-eslint': tseslint.plugin,
    react,
  },
  files: ['src/**/*.{ts,tsx}'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
  },
});
