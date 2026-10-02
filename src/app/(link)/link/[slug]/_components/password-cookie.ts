/** Nama cookie password per halaman link (dipakai page & server action). */
export const passwordCookieName = (slug: string) =>
  `link-pw-${slug.replace(/[^a-zA-Z0-9_-]/g, '')}`;
