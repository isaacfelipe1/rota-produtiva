"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  approveTutor,
  deleteTutor,
  getAllTutors,
  getPendingTutors,
  rejectTutor,
  type AllTutor,
  type PendingTutor,
} from "@/lib/api";
import { AdminPanel } from "@/components/admin-panel";

export default function AdminTutorsPage() {
  const router = useRouter();
  const [pendingTutors, setPendingTutors] = useState<PendingTutor[]>([]);
  const [allTutors, setAllTutors] = useState<AllTutor[]>([]);
  const token = typeof window !== "undefined" ? window.localStorage.getItem("rota_produtiva_admin_token") ?? "" : "";
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAllTutors, setIsLoadingAllTutors] = useState(true);

  useEffect(() => {
    if (!token) {
      router.replace("/admin");
    }
  }, [router, token]);

  useEffect(() => {
    if (!token) {
      return;
    }

    let isMounted = true;

    const loadAdminData = async () => {
      try {
        setIsLoading(true);
        setIsLoadingAllTutors(true);

        const [pending, all] = await Promise.all([
          getPendingTutors(token),
          getAllTutors(token),
        ]);

        if (!isMounted) {
          return;
        }

        setPendingTutors(pending);
        setAllTutors(all);
      } catch (error) {
        console.error(error);
        if (isMounted) {
          setStatusMessage(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar os dados dos tutores.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsLoadingAllTutors(false);
        }
      }
    };

    void loadAdminData();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const refreshTutors = async () => {
    if (!token) {
      return;
    }

    const [pending, all] = await Promise.all([
      getPendingTutors(token),
      getAllTutors(token),
    ]);

    setPendingTutors(pending);
    setAllTutors(all);
  };

  const handleTutorDecision = async (id: string, action: "approve" | "reject") => {
    if (!token) {
      setStatusMessage("Faça login como administrador para aprovar ou rejeitar tutores.");
      return;
    }

    try {
      if (action === "approve") {
        await approveTutor(id, token);
        setStatusMessage("Tutor aprovado com sucesso.");
      } else {
        await rejectTutor(id, token);
        setStatusMessage("Tutor rejeitado com sucesso.");
      }

      await refreshTutors();
    } catch (error) {
      console.error(error);
      setStatusMessage(error instanceof Error ? error.message : "Não foi possível atualizar o tutor.");
    }
  };

  const handleDeleteTutor = async (id: string) => {
    if (!token) {
      setStatusMessage("Faça login como administrador para excluir tutores.");
      return;
    }

    const confirmed = window.confirm(
      "Tem certeza que deseja excluir este tutor? Esta ação removerá o tutor e seus cursos relacionados.",
    );
    if (!confirmed) {
      return;
    }

    try {
      await deleteTutor(id, token);
      setStatusMessage("Tutor excluído com sucesso.");
      await refreshTutors();
    } catch (error) {
      console.error(error);
      setStatusMessage(error instanceof Error ? error.message : "Não foi possível excluir o tutor.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("rota_produtiva_admin_token");
    localStorage.removeItem("rota_produtiva_admin_name");
    router.replace("/admin");
  };

  const getStatusClasses = (status?: string) => {
    switch (status) {
      case "Aprovado":
        return "bg-emerald-500/15 text-emerald-200 border border-emerald-400/30";
      case "Pendente":
        return "bg-amber-500/15 text-amber-100 border border-amber-400/30";
      case "Rejeitado":
        return "bg-red-500/15 text-red-200 border border-red-400/30";
      default:
        return "bg-slate-700 text-slate-200 border border-slate-600";
    }
  };

  const formatDate = (value?: string) => {
    if (!value) {
      return "—";
    }

    return new Date(value).toLocaleDateString("pt-BR");
  };

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 rounded-3xl border border-emerald-400/30 bg-linear-to-br from-emerald-500/10 via-slate-900 to-slate-950 p-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-300">Painel administrativo</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white">Tutores</h1>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Sair
        </button>
      </div>

      {statusMessage ? (
        <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-4 text-sm text-emerald-100">
          {statusMessage}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 text-slate-300">
          Carregando tutores pendentes...
        </div>
      ) : (
        <AdminPanel
          pendingTutors={pendingTutors}
          onApprove={(id) => void handleTutorDecision(id, "approve")}
          onReject={(id) => void handleTutorDecision(id, "reject")}
          onDelete={(id) => void handleDeleteTutor(id)}
        />
      )}

      <section className="rounded-3xl border border-white/10 bg-slate-900 p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-300">Listagem completa</p>
            <h2 className="mt-2 text-3xl font-bold text-white">Todos os tutores</h2>
          </div>
        </div>

        {isLoadingAllTutors ? (
          <div className="rounded-2xl border border-white/10 bg-slate-800 p-4 text-slate-300">
            Carregando tutores...
          </div>
        ) : allTutors.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-slate-800 p-6 text-slate-300">
            Nenhum tutor cadastrado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm text-slate-200">
              <thead>
                <tr className="text-slate-400">
                  <th className="px-3 py-3 font-medium">Nome</th>
                  <th className="px-3 py-3 font-medium">Email</th>
                  <th className="px-3 py-3 font-medium">WhatsApp</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-3 py-3 font-medium">Cursos</th>
                  <th className="px-3 py-3 font-medium">Cadastrado em</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {allTutors.map((tutor) => (
                  <tr key={tutor.id} className="align-middle">
                    <td className="px-3 py-3 font-medium text-white">{tutor.nome}</td>
                    <td className="px-3 py-3">{tutor.email}</td>
                    <td className="px-3 py-3">{tutor.whatsApp}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(tutor.statusAprovacao)}`}>
                        {tutor.statusAprovacao}
                      </span>
                    </td>
                    <td className="px-3 py-3">{tutor.totalCursos}</td>
                    <td className="px-3 py-3">{formatDate(tutor.criadoEm)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  );
}
