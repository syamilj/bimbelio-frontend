/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: [
    'prettier-plugin-organize-imports',
    'prettier-plugin-packagejson',
    'prettier-plugin-toml',
    // Harus terakhir agar pengurutan kelas Tailwind tidak tertimpa plugin lain.
    'prettier-plugin-tailwindcss',
  ],
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  printWidth: 80,
  arrowParens: 'always',
  trailingComma: 'all',
  singleAttributePerLine: true,

  // Tailwind 4: kelas dibaca dari stylesheet, bukan tailwind.config.
  tailwindStylesheet: './src/styles/globals.css',
  tailwindFunctions: ['cn', 'cva'],
};

export default config;
