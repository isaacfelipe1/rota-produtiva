import type { Course } from "@/lib/api";

type CourseListProps = {
  courses: Course[];
  selectedCourseId: string;
  isLoadingCourses: boolean;
  onRefresh: () => void;
  onSelectCourse: (courseId: string) => void;
};

export function CourseList({
  courses,
  selectedCourseId,
  isLoadingCourses,
  onRefresh,
  onSelectCourse,
}: CourseListProps) {
  return (
    <section id="cursos" className="mt-16">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-300">Cursos disponíveis</p>
          <h2 className="mt-2 text-3xl font-bold">Qualificação e renda em ação</h2>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
        >
          Atualizar lista
        </button>
      </div>

      {isLoadingCourses ? (
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-8 text-slate-300">Carregando cursos...</div>
      ) : courses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900 p-8 text-slate-300">
          Nenhum curso disponível no momento.
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-3">
          {courses.map((course) => (
            <article
              key={course.id}
              className={`rounded-3xl border p-5 transition ${
                selectedCourseId === course.id
                  ? "border-emerald-400/60 bg-emerald-500/10 shadow-lg shadow-emerald-900/20"
                  : "border-white/10 bg-slate-900/70"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex rounded-full bg-emerald-400/15 px-2.5 py-1 text-xs font-medium text-emerald-200">
                  {course.modalidade}
                </span>
                <span className="text-xs text-slate-400">{course.vagasDisponiveis} vagas</span>
              </div>

              <h3 className="mt-4 text-2xl font-bold text-white">{course.titulo}</h3>
              <p className="mt-3 line-clamp-4 text-sm text-slate-300">{course.descricao}</p>

              <dl className="mt-5 space-y-2 text-sm text-slate-300">
                <div className="flex justify-between gap-3">
                  <dt>Início</dt>
                  <dd>{new Date(course.dataInicio).toLocaleDateString("pt-BR")}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Carga</dt>
                  <dd>{course.cargaHoraria}h</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Vagas</dt>
                  <dd>{course.vagas}</dd>
                </div>
                {course.local ? (
                  <div className="flex justify-between gap-3">
                    <dt>Local</dt>
                    <dd>{course.local}</dd>
                  </div>
                ) : null}
              </dl>

              <button
                type="button"
                onClick={() => onSelectCourse(course.id)}
                className="mt-6 w-full rounded-full bg-white px-4 py-2.5 font-semibold text-slate-900 transition hover:bg-slate-200"
              >
                Selecionar curso
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
