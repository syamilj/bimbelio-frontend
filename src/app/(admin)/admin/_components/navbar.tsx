"use client";

import Link from "next/link";

import UserAccountNav from "@/components/_shared/navbar/user-account-nav";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import NextBreadcrumb from "./next-breadcrumb";
import { useSession } from "@/components/provider/session-provider-auth";

export default function Navbar() {
  // Kita bisa destructuring { data, status } untuk memantau apakah session sedang "loading"
  // atau sudah "authenticated"/"unauthenticated"
  const { data: session } = useSession();

  // Jika Kamu ingin menampilkan indikasi loading saat session belum siap
  // if (status === "loading") {
  //   return (
  //     <div className="flex h-full items-center justify-between border-b bg-white p-4 pr-10 shadow-sm">
  //       <Loader2 className="w-4 h-4 animate-spin" />
  //     </div>
  //   );
  // }

  return (
    <div className="flex h-full items-center justify-between border-b bg-white p-4 pr-10 shadow-sm max-sm:justify-between">
      {/* Breadcrumb di sisi kiri */}
      <NextBreadcrumb />

      {/* Cek apakah user sudah login */}
      {session?.user ? (
        // Jika sudah login, tampilkan info user
        <UserAccountNav user={session.user} />
      ) : (
        // Jika belum login
        <Button asChild>
          <Link href="/auth/login">Masuk</Link>
        </Button>
      )}
    </div>
  );
}
