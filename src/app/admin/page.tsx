"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import { loginUser } from "@/lib/api";
import { AdminLoginCard } from "@/components/admin-login-card";

export default function AdminPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("rota_produtiva_admin_token");
    if (token) {
      router.replace("/admin/tutores");
    }
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await loginUser({
        email,
        senha,
      });

      const token = response?.token ?? "";
      const userName = response?.usuario?.nome ?? response?.nome ?? email;
      const userType = response?.usuario?.tipoUsuario ?? response?.tipo ?? "";

      if (!token) {
        setStatusMessage("Falha ao receber o token de autenticação do administrador.");
        return;
      }

      if (userType && String(userType).toLowerCase() !== "admin" && String(userType) !== "2") {
        setStatusMessage("Credenciais inválidas para acesso administrativo.");
        return;
      }

      localStorage.setItem("rota_produtiva_admin_token", token);
      localStorage.setItem("rota_produtiva_admin_name", userName);
      setStatusMessage("Login do administrador realizado com sucesso.");
      router.push("/admin/tutores");
    } catch (error) {
      console.error(error);
      setStatusMessage(
        error instanceof Error ? error.message : "Não foi possível realizar o login do administrador.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-slate-950/40">
        <AdminLoginCard
          email={email}
          senha={senha}
          isSubmitting={isSubmitting}
          statusMessage={statusMessage}
          onEmailChange={setEmail}
          onPasswordChange={setSenha}
          onSubmit={handleSubmit}
        />
      </div>

      <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-300">Área restrita</p>
        <h2 className="mt-3 text-4xl font-black tracking-tight text-white">Acesso exclusivo do administrador</h2>
        <ul className="mt-6 space-y-4 text-slate-300">
          <li className="rounded-2xl bg-slate-800 p-4">• Gerencie as solicitações de tutores pendentes.</li>
          <li className="rounded-2xl bg-slate-800 p-4">• Aprove ou rejeite candidatos na página específica de tutores.</li>
          <li className="rounded-2xl bg-slate-800 p-4">• A área pública continua aberta para inscrições.</li>
        </ul>
      </div>
    </section>
  );
}
