"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { registerUser } from "@/lib/api";
import { clearTutorSession, isTutorApprovedStatus, saveTutorSession } from "@/lib/tutor-auth";

const initialTutorForm = {
  nome: "",
  email: "",
  senha: "",
  whatsApp: "",
};

export default function TutorPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialTutorForm);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof typeof initialTutorForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const whatsAppLimpo = form.whatsApp.replace(/\D/g, "");

      const response = await registerUser({
        nome: form.nome,
        email: form.email,
        senha: form.senha,
        whatsApp: whatsAppLimpo,
        tipo: 1,
      });

      const token = response?.token ?? "";
      const userName = response?.usuario?.nome ?? response?.nome ?? (form.nome || "Tutor");
      const statusAprovacao = response?.usuario?.statusAprovacao ?? response?.statusAprovacao ?? "";

      if (token && isTutorApprovedStatus(statusAprovacao)) {
        saveTutorSession({ token, userName, statusAprovacao });
        router.push("/tutor/cursos");
      } else {
        clearTutorSession();
      }

      setStatusMessage("Solicitação enviada com sucesso. Aguarde a aprovação do administrador para publicar cursos.");
      setForm(initialTutorForm);
    } catch (error) {
      console.error(error);
      setStatusMessage(
        error instanceof Error ? error.message : "Não foi possível enviar a solicitação de tutor.",
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
            <Link href="/#inscricao" className="transition hover:text-white">Inscrição</Link>
            <Link href="/tutor" className="transition hover:text-white">Tutor</Link>
            <Link href="/admin" className="transition hover:text-white">Admin</Link>
          </nav>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-300">Seja tutor</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white">Compartilhe conhecimento e publique cursos</h1>
            <p className="mt-4 text-slate-300">
              Cadastre-se como tutor, envie sua proposta e aguarde a aprovação da administração para começar a criar cursos na plataforma.
            </p>

            <div className="mt-8 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
              Importante: tutores passam por revisão antes de publicar conteúdo.
            </div>

          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm text-slate-300">Nome</label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={(event) => handleChange("nome", event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                  placeholder="Seu nome completo"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">E-mail</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => handleChange("email", event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">WhatsApp</label>
                <input
                  type="text"
                  value={form.whatsApp}
                  onChange={(event) => handleChange("whatsApp", event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                  placeholder="(99) 99999-9999"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">Senha</label>
                <input
                  type="password"
                  value={form.senha}
                  onChange={(event) => handleChange("senha", event.target.value)}
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
                {isSubmitting ? "Enviando..." : "Quero ser tutor"}
              </button>
            </form>

            {statusMessage ? (
              <div className="mt-5 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-sm text-emerald-100">
                {statusMessage}
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
