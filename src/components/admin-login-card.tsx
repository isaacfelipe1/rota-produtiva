import type { FormEvent } from "react";

type AdminLoginCardProps = {
  email: string;
  senha: string;
  isSubmitting: boolean;
  statusMessage: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void> | void;
};

export function AdminLoginCard({
  email,
  senha,
  isSubmitting,
  statusMessage,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: AdminLoginCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-slate-950/40">
      <p className="text-sm font-medium uppercase tracking-[0.25em] text-emerald-300">Acesso ao sistema</p>
      <h2 className="mt-3 text-4xl font-black tracking-tight text-white">Entrar na plataforma</h2>

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <div>
          <label className="mb-2 block text-sm text-slate-300">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
            placeholder="admin@rotaprodutiva.com"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(event) => onPasswordChange(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-white px-6 py-3 text-lg font-bold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Processando..." : "Entrar"}
        </button>
      </form>

      {statusMessage ? (
        <div className="mt-5 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-sm text-emerald-100">
          {statusMessage}
        </div>
      ) : null}
    </div>
  );
}
