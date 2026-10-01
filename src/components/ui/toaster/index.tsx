import { toast } from 'sonner';

interface ToasterProps {
  title: string;
  /** 'warning' dipakai kode lama untuk kegagalan → ditampilkan sebagai error. */
  condition?: 'success' | 'warning';
  description?: string;
  duration?: number;
  /** Tidak dipakai lagi (dulu menampilkan jam & tanggal). */
  noDate?: boolean;
}

/** API toast lama. Kode baru cukup memakai `toast` dari 'sonner'. */
export const toaster = ({
  title,
  condition = 'success',
  description,
  duration = 3000,
}: ToasterProps) => {
  const show = condition === 'warning' ? toast.error : toast.success;
  show(title, { description, duration });
};
