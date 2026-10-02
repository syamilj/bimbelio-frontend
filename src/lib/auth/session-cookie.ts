// Nama cookie sesi; dipakai client (auth-helper) dan server (proxy).

/** Token di cookie yang bisa dibaca JS (mode lama, juga di preview Vercel). */
export const LEGACY_TOKEN_COOKIE = 'token';
/** Cookie httpOnly dari backend; hanya terbaca server (proxy). */
export const SESSION_COOKIE = 'bimbelio_session';
/** Penanda "ada sesi" dari backend, tanpa isi rahasia. */
export const SESSION_FLAG_COOKIE = 'bimbelio_auth';
