// src/app/(user)/layout.tsx (SERVER layout)
import LayoutGuest from "@/components/layout/layoutGuest";
import ProviderApp from "@/components/provider/provider-app";
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
  return (
    <ProviderApp>
      <LayoutGuest>{children}</LayoutGuest>
    </ProviderApp>
  );
}
