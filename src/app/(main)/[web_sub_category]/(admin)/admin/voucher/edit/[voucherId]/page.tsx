'use client';

import { useParams } from 'next/navigation';
import { VoucherForm } from '../../_components/voucher-form';

export default function EditVoucherPage() {
  const { voucherId } = useParams<{ voucherId: string }>();
  return <VoucherForm voucherId={voucherId} />;
}
