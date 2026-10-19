"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import { createCourse, getCourses } from "@/lib/api";
import { clearTutorSession, readTutorSession } from "@/lib/tutor-auth";

const initialCourseForm = {
  titulo: "",
  descricao: "",
  dataInicio: "",
  cargaHoraria: "",
  vagas: "",
  modalidade: "Online",
  local: "",
};

export default function TutorCoursesPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialCourseForm);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [token, setToken] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const session = readTutorSession();

    if (!session.token) {
      router.replace("/tutor/login");
      return;
    }

    if (!session.isApproved) {
      clearTutorSession();
      router.replace("/tutor");
      return;
    }

    setToken(session.token);
    setIsAuthorized(true);
  }, [router]);

  const handleChange = (field: keyof typeof initialCourseForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      if (!token) {
        setStatusMessage("Sessão expirada. Faça login novamente como tutor.");
        return;
      }

      const modalidade: "Presencial" | "Online" =
        form.modalidade === "Presencial" ? "Presencial" : "Online";

      const payload = {
        titulo: form.titulo,
        descricao: form.descricao,
        dataInicio: new Date(form.dataInicio).toISOString(),
        cargaHoraria: Number(form.cargaHoraria),
        vagas: Number(form.vagas),
        modalidade,
        local: modalidade === "Presencial" ? form.local || null : null,
      };

      await createCourse(token, payload);
      setStatusMessage("Curso publicado com sucesso.");
      setForm(initialCourseForm);
      await getCourses();
    } catch (error) {
      console.error(error);
      setStatusMessage(
        error instanceof Error ? error.message : "Não foi possível publicar o curso.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthorized) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="rounded-3xl border border-white/10 bg-slate-900 p-8 text-slate-300">
            Verificando acesso do tutor...
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
            <Link href="/tutor" className="transition hover:text-white">Tutor</Link>
            <Link href="/admin" className="transition hover:text-white">Admin</Link>
          </nav>
        </header>

        <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-300">Tutor</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white">Publicar novo curso</h1>
            <p className="mt-4 text-slate-300">
              Só tutores aprovados podem criar cursos. Preencha os dados do curso para publicar na plataforma.
            </p>

            <div className="mt-8 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
              Ao publicar, o curso fica disponível para inscrição pública.
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm text-slate-300">Título</label>
                <input
                  type="text"
                  value={form.titulo}
                  onChange={(event) => handleChange("titulo", event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                  placeholder="Ex.: Marketing Digital para iniciantes"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">Descrição</label>
                <textarea
                  value={form.descricao}
                  onChange={(event) => handleChange("descricao", event.target.value)}
                  className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                  placeholder="Descreva o curso, objetivos e público"
                  required
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">Data de início</label>
                  <input
                    type="date"
                    value={form.dataInicio}
                    onChange={(event) => handleChange("dataInicio", event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">Carga horária</label>
                  <input
                    type="number"
                    min="1"
                    value={form.cargaHoraria}
                    onChange={(event) => handleChange("cargaHoraria", event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                    placeholder="20"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">Vagas</label>
                  <input
                    type="number"
                    min="1"
                    value={form.vagas}
                    onChange={(event) => handleChange("vagas", event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                    placeholder="30"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">Modalidade</label>
                  <select
                    value={form.modalidade}
                    onChange={(event) => handleChange("modalidade", event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                  >
                    <option value="Online">Online</option>
                    <option value="Presencial">Presencial</option>
                  </select>
                </div>
              </div>

              {form.modalidade === "Presencial" ? (
                <div>
                  <label className="mb-2 block text-sm text-slate-300">Local</label>
                  <input
                    type="text"
                    value={form.local}
                    onChange={(event) => handleChange("local", event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                    placeholder="Rua, bairro ou endereço"
                  />
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-emerald-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Publicando..." : "Publicar curso"}
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
