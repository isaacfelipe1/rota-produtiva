export const TUTOR_TOKEN_KEY = "rota_produtiva_tutor_token";
export const TUTOR_NAME_KEY = "rota_produtiva_tutor_name";
export const TUTOR_APPROVED_KEY = "rota_produtiva_tutor_aprovado";

export function isTutorApprovedStatus(
  value?: string | number | boolean | null,
): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value === 1;
  }

  const normalized = String(value ?? "")
    .trim()
    .toLowerCase();
  if (!normalized) {
    return false;
  }

  const approvedValues = [
    "aprovado",
    "aprovada",
    "approved",
    "active",
    "ativo",
    "ativa",
    "true",
    "1",
    "yes",
    "sim",
  ];

  return approvedValues.includes(normalized) || normalized.includes("aprov");
}

export function readTutorSession() {
  if (typeof window === "undefined") {
    return {
      token: "",
      userName: "",
      isApproved: false,
      status: "",
    };
  }

  const token = localStorage.getItem(TUTOR_TOKEN_KEY) ?? "";
  const userName = localStorage.getItem(TUTOR_NAME_KEY) ?? "";
  const status = localStorage.getItem(TUTOR_APPROVED_KEY) ?? "";

  return {
    token,
    userName,
    isApproved: isTutorApprovedStatus(status),
    status,
  };
}

export function saveTutorSession({
  token,
  userName,
  statusAprovacao,
}: {
  token: string;
  userName: string;
  statusAprovacao?: string | number | boolean | null;
}) {
  if (typeof window === "undefined") {
    return;
  }

  const approved = isTutorApprovedStatus(statusAprovacao) ? "true" : "false";

  localStorage.setItem(TUTOR_TOKEN_KEY, token);
  localStorage.setItem(TUTOR_NAME_KEY, userName);
  localStorage.setItem(TUTOR_APPROVED_KEY, approved);
}

export function clearTutorSession() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(TUTOR_TOKEN_KEY);
  localStorage.removeItem(TUTOR_NAME_KEY);
  localStorage.removeItem(TUTOR_APPROVED_KEY);
}
