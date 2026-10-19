import type { FormEvent } from "react";

type EnrollmentFormProps = {
  selectedCourseId: string;
  courses: Array<{ id: string; titulo: string }>;
  enrollmentForm: {
    cursoId: string;
    nome: string;
    email: string;
    whatsapp: string;
  };
  isSubmitting: boolean;
  onCourseChange: (courseId: string) => void;
  onFieldChange: (field: keyof EnrollmentFormProps["enrollmentForm"], value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void> | void;
};

export function EnrollmentForm({
  selectedCourseId,
  courses,
  enrollmentForm,
  isSubmitting,
  onCourseChange,
  onFieldChange,
  onSubmit,
}: EnrollmentFormProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-300">Inscrições públicas</p>
      <h2 className="mt-2 text-3xl font-bold text-white">Inscreva-se em um curso</h2>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-2 block text-sm text-slate-300">Curso</label>
          <select
            value={selectedCourseId}
            onChange={(event) => onCourseChange(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none ring-0 transition focus:border-emerald-400"
            required
          >
            <option value="">Selecione um curso</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.titulo}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Nome</label>
            <input
              type="text"
              value={enrollmentForm.nome}
              onChange={(event) => onFieldChange("nome", event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
              placeholder="Seu nome completo"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">WhatsApp</label>
            <input
              type="text"
              value={enrollmentForm.whatsapp}
              onChange={(event) => onFieldChange("whatsapp", event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
              placeholder="(99) 99999-9999"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">E-mail</label>
          <input
            type="email"
            value={enrollmentForm.email}
            onChange={(event) => onFieldChange("email", event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
            placeholder="voce@email.com"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-emerald-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Enviando..." : "Confirmar inscrição"}
        </button>
      </form>
    </div>
  );
}
