import {
  AuthResult,
  DashboardSummary,
  ExpenseInput,
  IncomeInput,
  Product,
  ProductInput,
  ProfitLossReport,
  ReportGroupBy,
  Transaction,
} from "../types/Models";

export const TokenKey = "DagangTrackToken";
export const UserKey = "DagangTrackUser";
export const UnauthorizedEvent = "dagangtrack:unauthorized";

export class ApiError extends Error {
  constructor(public Status: number, message: string) {
    super(message);
  }
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      search.set(key, String(value));
    }
  });
  const text = search.toString();
  return text ? `?${text}` : "";
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const token = localStorage.getItem(TokenKey);
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`/api${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  } catch {
    throw new ApiError(0, "Tidak dapat terhubung ke server. Periksa koneksi Anda.");
  }

  const data = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 401 && token) {
      window.dispatchEvent(new Event(UnauthorizedEvent));
    }
    throw new ApiError(response.status, data?.Message ?? "Terjadi kesalahan. Silakan coba lagi.");
  }
  return data as T;
}

export const api = {
  register: (body: { Name: string; StoreName: string; Email: string; Password: string }) =>
    request<AuthResult>("POST", "/auth/register", body),
  login: (body: { Email: string; Password: string }) => request<AuthResult>("POST", "/auth/login", body),

  getProducts: () => request<Product[]>("GET", "/products"),
  createProduct: (body: ProductInput) => request<Product>("POST", "/products", body),
  updateProduct: (id: string, body: ProductInput) => request<Product>("PUT", `/products/${id}`, body),
  deleteProduct: (id: string) => request<void>("DELETE", `/products/${id}`),

  getTransactions: (params: { StartDate?: string; EndDate?: string; Limit?: number } = {}) =>
    request<Transaction[]>("GET", `/transactions${buildQuery(params)}`),
  createIncome: (body: IncomeInput) => request<Transaction>("POST", "/transactions/income", body),
  createExpense: (body: ExpenseInput) => request<Transaction>("POST", "/transactions/expense", body),
  deleteTransaction: (id: string) => request<void>("DELETE", `/transactions/${id}`),

  getSummary: (startDate: string, endDate: string) =>
    request<DashboardSummary>("GET", `/dashboard/summary${buildQuery({ StartDate: startDate, EndDate: endDate })}`),
  getProfitLoss: (startDate: string, endDate: string, groupBy: ReportGroupBy) =>
    request<ProfitLossReport>(
      "GET",
      `/reports/profit-loss${buildQuery({ StartDate: startDate, EndDate: endDate, GroupBy: groupBy })}`
    ),
};
