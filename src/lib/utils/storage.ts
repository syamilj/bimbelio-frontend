export const sanitizeFileName = (fileName: string): string => {
  return (
    fileName
      .toLowerCase()
      // Hapus atau ganti karakter khusus
      .replace(/[^a-z0-9\s.-]/g, '') // Hanya izinkan a-z, 0-9, spasi, titik, dash
      .replace(/\s+/g, '-') // Ganti spasi dengan dash
      .replace(/\.+/g, '.') // Ganti multiple dots dengan single dot
      .replace(/-+/g, '-') // Ganti multiple dash dengan single dash
      .replace(/^-+|-+$/g, '') // Hapus dash di awal dan akhir
      .trim()
  );
};
