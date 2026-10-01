import { ReportGroupBy } from "./Models";

export interface RegisterDto {
  Name: string;
  StoreName: string;
  Email: string;
  Password: string;
}

export interface LoginDto {
  Email: string;
  Password: string;
}

export interface ProductDto {
  Name: string;
  Price: number;
  Stock: number;
}

export interface IncomeItemDto {
  ProductId: string;
  Quantity: number;
}

export interface CreateIncomeDto {
  TransactionDate: string;
  Description: string;
  Items: IncomeItemDto[];
}

export interface CreateExpenseDto {
  TransactionDate: string;
  Description: string;
  TotalAmount: number;
}

export interface DateRangeDto {
  StartDate: string;
  EndDate: string;
}

export interface SummaryDto extends DateRangeDto {
  TotalIncome: number;
  TotalExpense: number;
  NetProfit: number;
}

export interface ProfitLossRowDto {
  Period: string;
  TotalIncome: number;
  TotalExpense: number;
  NetProfit: number;
}

export interface ProfitLossReportDto extends SummaryDto {
  GroupBy: ReportGroupBy;
  Rows: ProfitLossRowDto[];
}
