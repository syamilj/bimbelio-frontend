import type { z } from 'zod';

type Issue = z.core.$ZodRawIssue;

const isBlank = (input: unknown) =>
  input === undefined ||
  input === null ||
  input === '' ||
  (typeof input === 'number' && Number.isNaN(input));

/**
 * Pesan error zod yang ramah dalam bahasa Indonesia untuk form admin.
 * Pesan khusus di skema (`z.string().min(1, 'Judul wajib diisi')`) tetap
 * diutamakan; peta ini hanya mengisi yang belum ditulis.
 */
export function idErrorMap(issue: Issue): string {
  switch (issue.code) {
    case 'invalid_type': {
      if (isBlank(issue.input)) return 'Wajib diisi';
      if (issue.expected === 'number') return 'Harus berupa angka';
      if (issue.expected === 'date') return 'Tanggal tidak valid';
      return 'Isian tidak valid';
    }
    case 'too_small': {
      const min = Number(issue.minimum);
      if (issue.origin === 'string')
        return min <= 1 ? 'Wajib diisi' : `Minimal ${min} karakter`;
      if (issue.origin === 'array' || issue.origin === 'set')
        return min <= 1 ? 'Pilih minimal satu' : `Pilih minimal ${min}`;
      if (issue.origin === 'date') return 'Tanggal terlalu awal';
      return issue.inclusive ? `Minimal ${min}` : `Harus lebih dari ${min}`;
    }
    case 'too_big': {
      const max = Number(issue.maximum);
      if (issue.origin === 'string') return `Maksimal ${max} karakter`;
      if (issue.origin === 'array' || issue.origin === 'set')
        return `Pilih maksimal ${max}`;
      if (issue.origin === 'date') return 'Tanggal terlalu jauh';
      return issue.inclusive ? `Maksimal ${max}` : `Harus kurang dari ${max}`;
    }
    case 'invalid_format': {
      if (issue.format === 'email') return 'Format email tidak valid';
      if (issue.format === 'url') return 'Format URL tidak valid';
      if (issue.format === 'datetime' || issue.format === 'date')
        return 'Tanggal tidak valid';
      return 'Format tidak valid';
    }
    case 'invalid_value':
      return 'Pilih salah satu opsi';
    case 'not_multiple_of':
      return `Harus kelipatan ${issue.divisor}`;
    default:
      return 'Isian tidak valid';
  }
}
