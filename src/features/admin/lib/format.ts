// Format tampilan data admin (zona waktu perangkat, bahasa Indonesia).

const toDate = (value: string | number | Date | null | undefined) => {
  if (value === null || value === undefined || value === '') return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

export function formatDate(
  value: string | number | Date | null | undefined,
  style: 'short' | 'long' = 'short',
) {
  const d = toDate(value);
  if (!d) return '–';
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: style === 'long' ? 'long' : 'short',
    year: 'numeric',
  });
}

export function formatTime(value: string | number | Date | null | undefined) {
  const d = toDate(value);
  if (!d) return '–';
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

export function formatDateTime(
  value: string | number | Date | null | undefined,
) {
  const d = toDate(value);
  if (!d) return '–';
  return `${formatDate(d)} · ${formatTime(d)}`;
}

export const formatNumber = (value: number | null | undefined, digits = 0) =>
  value === null || value === undefined || Number.isNaN(value)
    ? '–'
    : value.toLocaleString('id-ID', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      });

/** `YYYY-MM-DDTHH:mm` waktu lokal, untuk `<input type="datetime-local">`. */
export function toLocalInput(value: string | number | Date | null | undefined) {
  const d = toDate(value);
  if (!d) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Potong ID panjang untuk tampilan ringkas (DM Mono). */
export const shortId = (id: string, size = 8) =>
  id.length > size ? `${id.slice(0, size)}…` : id;
