// prettier.config.mjs

/**
 * @type {import('prettier').Config &
 *        import('prettier-plugin-tailwindcss').options &
 *        import('prettier-plugin-organize-imports').options &
 *        import('prettier-plugin-prisma').options &
 *        import('prettier-plugin-packagejson').options &
 *        import('prettier-plugin-toml').options
 * }
 */
const config = {
  // 1. Daftar plugin
  plugins: [
    'prettier-plugin-tailwindcss',
    'prettier-plugin-organize-imports',
    'prettier-plugin-prisma',
    'prettier-plugin-packagejson',
    'prettier-plugin-toml',
  ],

  // 2. Pengaturan dasar Prettier
  semi: true, // true = tambahkan tanda ; di akhir
  singleQuote: true, // Menggunakan tanda kutip tunggal
  tabWidth: 2, // Indentasi menggunakan 2 spasi
  printWidth: 80, // Panjang maksimal baris
  arrowParens: 'always', // Tambahkan kurung pada arrow function
  trailingComma: 'all', // Tambahkan koma di akhir object/array, dsb.
  singleAttributePerLine: true,

  // 3. Pengaturan tambahan untuk plugin
  // --- 3.1 Tailwind CSS
  tailwindConfig: './tailwind.config.ts', // jika file config tidak default

  // --- 3.2 Organize Imports (prettier-plugin-organize-imports)
  // --- 3.3 Prisma
  // Tidak ada pengaturan khusus, tapi pastikan file .prisma tersupport

  // --- 3.4 Package.json
  // Secara default akan mengurutkan field-field di package.json

  // --- 3.5 TOML
  // Untuk file TOML, plugin akan otomatis memformat

  // 4. Tambahkan pengaturan lainnya sesuai kebutuhan Kamu
};

export default config;
