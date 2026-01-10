// eslint.config.js

// @ts-check
import js from '@eslint/js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';

// Impor plugin
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const config = [
  // Definisikan ignores di awal konfigurasi
  {
    ignores: [
      '**/.next/**',
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      // Tambahkan pola lain yang perlu diabaikan
    ],
  },
  ...compat.extends('next/core-web-vitals'),
  {
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          caughtErrors: 'none',
        },
      ],
      'react-hooks/exhaustive-deps': 'off',
      // Tambahkan aturan lainnya sesuai kebutuhan
    },
  },
];

export default config;
