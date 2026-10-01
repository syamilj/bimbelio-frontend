// eslint.config.js

// @ts-check
import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import tsEslint from 'typescript-eslint';

const config = [
  // Definisikan ignores di awal konfigurasi
  {
    ignores: ['**/.next/**', '**/node_modules/**', '**/dist/**', '**/build/**'],
  },
  js.configs.recommended,
  ...tsEslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx,mjs,mts}'],
    plugins: {
      'react-hooks': reactHooks,
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: 'module',
        jsx: true,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          caughtErrors: 'none',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'react-hooks/exhaustive-deps': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-undef': 'off',
      'no-useless-escape': 'off',
      'no-extra-boolean-cast': 'off',
      'no-empty': 'off',
      'no-case-declarations': 'off',
      'no-constant-binary-expression': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'no-unsafe-optional-chaining': 'off',
    },
  },
];

export default config;
