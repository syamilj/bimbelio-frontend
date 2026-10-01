// @ts-check
import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import tsEslint from 'typescript-eslint';

// Pagar sistem desain (docs/redesign/PLAN.md §3). Berlaku untuk kode baru /
// yang sudah dimigrasi; daftar direktori bertambah per fase sampai mencakup src/.
const DESIGN_SYSTEM_DIRS = [
  'src/app/layout.tsx',
  'src/app/not-found.tsx',
  'src/app/error.tsx',
  'src/components/ui/**',
  'src/components/patterns/**',
  'src/components/providers/**',
  'src/components/layout/**',
  'src/features/**',
  'src/lib/api/**',
  'src/lib/theme/**',
];

// Berkas lama di dalam direktori di atas yang belum dimigrasi. Kosongkan
// daftar ini seiring fase berjalan — jangan menambah berkas baru ke sini.
const DESIGN_SYSTEM_PENDING = [
  'src/components/ui/blocknote-editor/**',
  'src/components/ui/react-markdown*.tsx',
  'src/components/ui/blog-editor.tsx',
  'src/components/ui/date-range-picker.tsx',
  'src/components/ui/modal-verification.tsx',
  'src/lib/api/link-pages.ts',
  'src/lib/api/short-url.ts',
  'src/components/layout/layoutAdmin.tsx',
  'src/components/layout/layoutGuest.tsx',
  'src/components/layout/layoutUser.tsx',
];

const designSystemRules = {
  'no-restricted-syntax': [
    'error',
    {
      selector:
        'Literal[value=/(?:^|[\\s:"\'`])(?:bg|text|border|fill|stroke|ring|from|to|via|outline|shadow|decoration)-\\[#/]',
      message:
        'Warna hex arbitrer dilarang. Pakai token: bg-brand, text-ink-muted, border-line, dst.',
    },
    {
      selector:
        'TemplateElement[value.raw=/(?:^|[\\s:])(?:bg|text|border|fill|stroke|ring)-\\[#/]',
      message:
        'Warna hex arbitrer dilarang. Pakai token: bg-brand, text-ink-muted, border-line, dst.',
    },
    {
      selector:
        'Literal[value=/(?:^|[\\s:])text-\\[\\d+(?:\\.\\d+)?(?:px|rem)\\]/]',
      message:
        'Ukuran font arbitrer dilarang. Pakai skala: text-xs (12px) … text-4xl.',
    },
    {
      selector:
        "CallExpression[callee.property.name='reload'][callee.object.property.name='location']",
      message:
        'Jangan reload halaman untuk mengubah state; perbarui data lewat query/mutation.',
    },
  ],
  'no-restricted-imports': [
    'error',
    {
      paths: [
        { name: 'react-hot-toast', message: "Pakai toast dari 'sonner'." },
        { name: 'motion', message: "Pakai 'framer-motion'." },
        {
          name: 'use-media',
          message: 'Pakai kelas responsif Tailwind (sm:, lg:).',
        },
      ],
      patterns: [
        {
          group: ['@/lib/fetch-helper/*'],
          message: 'Kode baru memakai TanStack Query + @/lib/api/client.',
        },
        {
          group: ['@/lib/axios/*'],
          message: 'Kode baru memakai @/lib/api/client.',
        },
      ],
    },
  ],
};

const config = [
  {
    ignores: [
      '**/.next/**',
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      'public/sw.js',
    ],
  },
  js.configs.recommended,
  ...tsEslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx,mjs,mts}'],
    plugins: { 'react-hooks': reactHooks },
    languageOptions: {
      parserOptions: { ecmaVersion: 2024, sourceType: 'module', jsx: true },
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
  {
    files: DESIGN_SYSTEM_DIRS,
    ignores: DESIGN_SYSTEM_PENDING,
    rules: {
      ...designSystemRules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];

export default config;
