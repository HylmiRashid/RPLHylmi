export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
}

export function formatPeriod(period: string): string {
  if (period.length === 7) {
    return new Date(`${period}-01T00:00:00.000Z`).toLocaleDateString("id-ID", { month: "long", year: "numeric", timeZone: "UTC" });
  }
  return formatDate(`${period}T00:00:00.000Z`);
}

export function toDateInput(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function currentMonthRange(): { StartDate: string; EndDate: string } {
  const now = new Date();
  return {
    StartDate: toDateInput(new Date(now.getFullYear(), now.getMonth(), 1)),
    EndDate: toDateInput(new Date(now.getFullYear(), now.getMonth() + 1, 0)),
  };
}
