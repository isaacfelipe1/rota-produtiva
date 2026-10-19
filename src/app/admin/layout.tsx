"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("rota_produtiva_admin_token") : null;
  const isLoginPage = pathname === "/admin" || pathname === "/admin/";

  useEffect(() => {
    if (!token && !isLoginPage) {
      router.replace("/admin");
      return;
    }

    if (token && isLoginPage) {
      router.replace("/admin/tutores");
    }
  }, [token, isLoginPage, router]);

  if (!token && !isLoginPage) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-slate-900 p-8 text-slate-300">
            Verificando acesso administrativo...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <header className="mb-10 flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm">
          <Link href="/" className="text-lg font-semibold tracking-tight text-white">RotaProdutiva</Link>
          <nav className="flex flex-wrap items-center justify-end gap-4 text-sm text-slate-300 sm:gap-6">
            <Link href="/" className="transition hover:text-white">Início</Link>
            <Link href="/#inscricao" className="transition hover:text-white">Inscrição</Link>
            <Link href="/admin" className="transition hover:text-white">Admin</Link>
          </nav>
        </header>
        {children}
      </div>
    </main>
  );
}
