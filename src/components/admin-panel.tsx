import type { PendingTutor } from "@/lib/api";

type AdminPanelProps = {
  pendingTutors: PendingTutor[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
};

export function AdminPanel({ pendingTutors, onApprove, onReject, onDelete }: AdminPanelProps) {
  return (
    <section id="admin" className="mt-16 rounded-3xl border border-white/10 bg-slate-900 p-6">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-300">Administração</p>
      <h2 className="mt-2 text-3xl font-bold text-white">Tutores pendentes</h2>

      {pendingTutors.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-slate-800 p-6 text-slate-300">
          Nenhuma solicitação de tutor pendente.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {pendingTutors.map((tutor) => (
            <div key={tutor.id} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-800 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-lg font-semibold text-white">{tutor.nome}</p>
                <p className="text-sm text-slate-300">{tutor.email}</p>
                <p className="text-sm text-slate-400">{tutor.whatsapp}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onApprove(tutor.id)}
                  className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
                >
                  Aprovar
                </button>
                <button
                  type="button"
                  onClick={() => onReject(tutor.id)}
                  className="rounded-full border border-red-400/40 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/20"
                >
                  Rejeitar
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(tutor.id)}
                  className="rounded-full border border-rose-400/40 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
