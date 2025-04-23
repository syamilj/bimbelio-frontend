// src/app/(user)/layout.tsx (SERVER layout)
import LayoutGuest from "@/components/layout/layoutGuest";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Belajar",
  description: "Siswa belajar di Bimbelio",
  openGraph: {
    title: "Belajar",
    description: "Siswa belajar di Bimbelio",
  },
};

export default function LayoutUser({ children }: { children: ReactNode }) {
  return <LayoutGuest>{children}</LayoutGuest>;
}
