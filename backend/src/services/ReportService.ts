import { ProfitLossReportDto, ProfitLossRowDto, SummaryDto } from "../types/Dtos";
import { ReportGroupBy, Transaction, TransactionType } from "../types/Models";
import { findTransactions } from "./TransactionService";

function sumByType(items: Transaction[], type: TransactionType): number {
  return items.filter((item) => item.Type === type).reduce((total, item) => total + item.TotalAmount, 0);
}

export async function buildSummary(userId: string, startDate: string, endDate: string): Promise<SummaryDto> {
  const items = await findTransactions(userId, startDate, endDate);
  const totalIncome = sumByType(items, TransactionType.Income);
  const totalExpense = sumByType(items, TransactionType.Expense);
  return { StartDate: startDate, EndDate: endDate, TotalIncome: totalIncome, TotalExpense: totalExpense, NetProfit: totalIncome - totalExpense };
}

export async function buildProfitLoss(
  userId: string,
  startDate: string,
  endDate: string,
  groupBy: ReportGroupBy
): Promise<ProfitLossReportDto> {
  const items = await findTransactions(userId, startDate, endDate);
  const length = groupBy === ReportGroupBy.Daily ? 10 : 7;
  const groups = new Map<string, Transaction[]>();

  for (const item of items) {
    const period = item.TransactionDate.slice(0, length);
    groups.set(period, [...(groups.get(period) ?? []), item]);
  }

  const rows: ProfitLossRowDto[] = [...groups.entries()]
    .map(([period, group]) => {
      const totalIncome = sumByType(group, TransactionType.Income);
      const totalExpense = sumByType(group, TransactionType.Expense);
      return { Period: period, TotalIncome: totalIncome, TotalExpense: totalExpense, NetProfit: totalIncome - totalExpense };
    })
    .sort((a, b) => b.Period.localeCompare(a.Period));

  const totalIncome = rows.reduce((total, row) => total + row.TotalIncome, 0);
  const totalExpense = rows.reduce((total, row) => total + row.TotalExpense, 0);
  return {
    GroupBy: groupBy,
    StartDate: startDate,
    EndDate: endDate,
    Rows: rows,
    TotalIncome: totalIncome,
    TotalExpense: totalExpense,
    NetProfit: totalIncome - totalExpense,
  };
}
