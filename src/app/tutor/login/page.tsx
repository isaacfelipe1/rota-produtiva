"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import { loginUser } from "@/lib/api";
import {
  clearTutorSession,
  isTutorApprovedStatus,
  readTutorSession,
  saveTutorSession,
} from "@/lib/tutor-auth";

export default function TutorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [statusMessage, setStatusMessage] = useState(() => {
    const session = readTutorSession();

    if (session.token && !session.isApproved) {
      clearTutorSession();
      return "Sua conta de tutor ainda não foi aprovada. Aguarde a revisão da administração.";
    }

    return "";
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const session = readTutorSession();

    if (session.token && session.isApproved) {
      router.replace("/tutor/cursos");
    }
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await loginUser({ email, senha });
      const token = response?.token ?? "";
      const userName = response?.usuario?.nome ?? response?.nome ?? email;
      const userType = response?.usuario?.tipoUsuario ?? response?.tipo ?? "";
      const statusAprovacao = response?.usuario?.statusAprovacao ?? response?.statusAprovacao ?? "";

      if (!token) {
        setStatusMessage("Falha ao receber o token de autenticação do tutor.");
        return;
      }

      const normalizedType = String(userType).toLowerCase();
      const isTutor = normalizedType === "tutor" || normalizedType === "1" || userType === 1;

      if (!isTutor) {
        setStatusMessage("Essa conta não tem acesso de tutor. Aguarde a aprovação ou use a área administrativa.");
        clearTutorSession();
        return;
      }

      if (!isTutorApprovedStatus(statusAprovacao)) {
        clearTutorSession();
        setStatusMessage("Sua conta de tutor ainda não foi aprovada pela administração. Aguarde a revisão antes de publicar cursos.");
        return;
      }

      saveTutorSession({ token, userName, statusAprovacao });
      router.push("/tutor/cursos");
    } catch (error) {
      console.error(error);
      setStatusMessage(
        error instanceof Error ? error.message : "Não foi possível realizar o login do tutor.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <header className="mb-10 flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm">
          <Link href="/" className="text-lg font-semibold tracking-tight text-white">RotaProdutiva</Link>
          <nav className="flex flex-wrap items-center justify-end gap-4 text-sm text-slate-300 sm:gap-6">
            <Link href="/" className="transition hover:text-white">Início</Link>
            <Link href="/tutor" className="transition hover:text-white">Tutor</Link>
            <Link href="/admin" className="transition hover:text-white">Admin</Link>
          </nav>
        </header>

        <section className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-2xl shadow-slate-950/40">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-emerald-300">Acesso do tutor</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white">Entrar como tutor</h1>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm text-slate-300">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                placeholder="tutor@email.com"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-emerald-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </button>
          </form>

          {statusMessage ? (
            <div className="mt-5 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-sm text-emerald-100">
              {statusMessage}
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
