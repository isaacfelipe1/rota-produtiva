import type { FormEvent } from "react";

type AuthCardProps = {
  authMode: "login" | "register";
  authForm: {
    nome: string;
    email: string;
    senha: string;
    whatsapp: string;
    tipoUsuario: "Aluno" | "Tutor" | "Admin";
  };
  isSubmitting: boolean;
  token: string;
  userName: string;
  onModeChange: (mode: "login" | "register") => void;
  onFieldChange: (field: keyof AuthCardProps["authForm"], value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void> | void;
};

export function AuthCard({
  authMode,
  authForm,
  isSubmitting,
  token,
  userName,
  onModeChange,
  onFieldChange,
  onSubmit,
}: AuthCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-300">Acesso ao sistema</p>
      <h2 className="mt-2 text-3xl font-bold text-white">
        {authMode === "login" ? "Entrar na plataforma" : "Criar conta"}
      </h2>

      <div className="mt-5 inline-flex rounded-full border border-white/10 bg-slate-800 p-1">
        <button
          type="button"
          onClick={() => onModeChange("login")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            authMode === "login" ? "bg-emerald-400 text-slate-950" : "text-slate-300"
          }`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => onModeChange("register")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            authMode === "register" ? "bg-emerald-400 text-slate-950" : "text-slate-300"
          }`}
        >
          Registrar
        </button>
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {authMode === "register" ? (
          <div>
            <label className="mb-2 block text-sm text-slate-300">Nome</label>
            <input
              type="text"
              value={authForm.nome}
              onChange={(event) => onFieldChange("nome", event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
              placeholder="Nome completo"
              required
            />
          </div>
        ) : null}

        <div>
          <label className="mb-2 block text-sm text-slate-300">E-mail</label>
          <input
            type="email"
            value={authForm.email}
            onChange={(event) => onFieldChange("email", event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
            placeholder="seu@email.com"
            required
          />
        </div>

        {authMode === "register" ? (
          <div>
            <label className="mb-2 block text-sm text-slate-300">WhatsApp</label>
            <input
              type="text"
              value={authForm.whatsapp}
              onChange={(event) => onFieldChange("whatsapp", event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
              placeholder="(99) 99999-9999"
              required
            />
          </div>
        ) : null}

        <div>
          <label className="mb-2 block text-sm text-slate-300">Senha</label>
          <input
            type="password"
            value={authForm.senha}
            onChange={(event) => onFieldChange("senha", event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
            placeholder="••••••••"
            required
          />
        </div>

        {authMode === "register" ? (
          <div>
            <label className="mb-2 block text-sm text-slate-300">Tipo de usuário</label>
            <select
              value={authForm.tipoUsuario}
              onChange={(event) => onFieldChange("tipoUsuario", event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
            >
              <option value="Aluno">Aluno</option>
              <option value="Tutor">Tutor</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-white px-6 py-3 font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Processando..." : authMode === "login" ? "Entrar" : "Criar conta"}
        </button>
      </form>

      {token ? (
        <div className="mt-5 rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-4 text-sm text-emerald-100">
          Conectado como <span className="font-semibold">{userName}</span>
        </div>
      ) : null}
    </div>
  );
}
