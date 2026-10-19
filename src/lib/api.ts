export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://localhost:7124";

async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers || {});

  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      cache: "no-store",
    });
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? `Não foi possível conectar com a API (${API_BASE_URL}). Verifique se o backend está rodando.`
        : "Não foi possível conectar com a API. Verifique se o backend está rodando.";

    throw new Error(message);
  }

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json().catch(() => null)
    : await response.text().catch(() => null);

  if (!response.ok) {
    const message =
      typeof payload === "string"
        ? payload
        : payload?.message ||
          payload?.title ||
          `Erro na requisição (${response.status})`;

    throw new Error(message);
  }

  return (payload ?? undefined) as T;
}

export type Course = {
  id: string;
  titulo: string;
  descricao: string;
  dataInicio: string;
  cargaHoraria: number;
  vagas: number;
  modalidade: string;
  local?: string | null;
  vagasDisponiveis: number;
  tutorId?: string;
  tutorNome?: string;
};

export type UserRegisterInput = {
  nome: string;
  email: string;
  senha: string;
  whatsApp: string;
  tipo: 0 | 1 | 2;
};

export type AuthLoginInput = {
  email: string;
  senha: string;
};

export type EnrollmentInput = {
  cursoId: string;
  nome: string;
  email: string;
  whatsapp: string;
};

export type CreateCourseInput = {
  titulo: string;
  descricao: string;
  dataInicio: string;
  cargaHoraria: number;
  vagas: number;
  modalidade: "Presencial" | "Online";
  local?: string | null;
};

export type AuthSession = {
  token?: string;
  usuario?: {
    id: string;
    nome: string;
    email: string;
    tipoUsuario?: string;
    statusAprovacao?: string;
  };
  usuarioId?: string;
  nome?: string;
  email?: string;
  tipo?: string | number;
  statusAprovacao?: string;
};

export type PendingTutor = {
  id: string;
  nome: string;
  email: string;
  whatsapp: string;
  tipoUsuario: string;
  statusAprovacao?: string;
};

export type AllTutor = {
  id: string;
  nome: string;
  email: string;
  whatsApp: string;
  statusAprovacao: string;
  totalCursos: number;
  criadoEm: string;
};

export async function getCourses(): Promise<Course[]> {
  return apiRequest<Course[]>("/api/cursos");
}

export async function registerUser(
  payload: UserRegisterInput,
): Promise<AuthSession> {
  return apiRequest<AuthSession>("/api/auth/registrar", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload: AuthLoginInput): Promise<AuthSession> {
  return apiRequest<AuthSession>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function enrollInCourse(
  payload: EnrollmentInput,
): Promise<unknown> {
  return apiRequest("/api/inscricoes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function createCourse(
  token: string,
  payload: CreateCourseInput,
): Promise<Course> {
  return apiRequest<Course>("/api/cursos", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function getPendingTutors(token: string): Promise<PendingTutor[]> {
  return apiRequest<PendingTutor[]>("/api/admin/tutores/pendentes", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getAllTutors(token: string): Promise<AllTutor[]> {
  return apiRequest<AllTutor[]>("/api/admin/tutores", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function approveTutor(
  id: string,
  token: string,
): Promise<unknown> {
  return apiRequest(`/api/admin/tutores/${id}/aprovar`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function rejectTutor(id: string, token: string): Promise<unknown> {
  return apiRequest(`/api/admin/tutores/${id}/rejeitar`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function deleteTutor(id: string, token: string): Promise<unknown> {
  return apiRequest(`/api/admin/tutores/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
