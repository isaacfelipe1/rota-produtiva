type HeroSectionProps = {
  statusMessage: string;
};

export function HeroSection({ statusMessage }: HeroSectionProps) {
  return (
    <section className="grid gap-8 rounded-3xl border border-emerald-400/30 bg-linear-to-br from-emerald-500/20 via-slate-900 to-slate-950 p-8 shadow-2xl shadow-emerald-900/20 lg:grid-cols-[1.3fr_0.7fr] lg:p-12">
      <div>
        <span className="inline-flex rounded-full border border-emerald-300/40 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
          ODS 4 • ODS 10
        </span>
        <h1 className="mt-6 max-w-xl text-4xl font-black tracking-tight text-white md:text-6xl">
          Conecte pessoas que querem aprender com tutores que querem ensinar.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-slate-300">
          A plataforma pública de cursos gratuitos de geração de renda, com inscrição aberta para qualquer pessoa e aprovação administrativa para tutores.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#cursos" className="rounded-full bg-emerald-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300">
            Ver cursos
          </a>
          <a href="#inscricao" className="rounded-full border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
            Inscreva-se
          </a>
          <a href="/tutor" className="rounded-full border border-emerald-300/40 bg-emerald-500/10 px-6 py-3 font-semibold text-emerald-200 transition hover:bg-emerald-500/20">
            Quero ser tutor
          </a>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-2xl font-bold text-emerald-300">+500</p>
            <p className="text-sm text-slate-300">vagas abertas</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-2xl font-bold text-emerald-300">98%</p>
            <p className="text-sm text-slate-300">qualificação focada</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-2xl font-bold text-emerald-300">24/7</p>
            <p className="text-sm text-slate-300">acesso público</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
        <h2 className="text-xl font-semibold">Status da plataforma</h2>
        <ul className="mt-5 space-y-4 text-sm text-slate-300">
          <li className="rounded-xl bg-slate-800 p-3">• Inscrição em cursos aberta para qualquer pessoa.</li>
          <li className="rounded-xl bg-slate-800 p-3">• Tutor precisa ser aprovado antes de publicar.</li>
          <li className="rounded-xl bg-slate-800 p-3">• Admin acompanha pendências e aprovações.</li>
        </ul>
        {statusMessage ? (
          <div className="mt-5 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-sm text-emerald-100">
            {statusMessage}
          </div>
        ) : null}
      </div>
    </section>
  );
}
