// src/app/(admin)/admin/layout.tsx (SERVER layout, no 'use client')
import AdminClientLayout from './layoutAdmin';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminClientLayout>{children}</AdminClientLayout>;
}
