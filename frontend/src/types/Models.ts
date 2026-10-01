export enum TransactionType {
  Income = "INCOME",
  Expense = "EXPENSE",
}

export enum ReportGroupBy {
  Daily = "daily",
  Monthly = "monthly",
}

export interface User {
  Id: string;
  Name: string;
  StoreName: string;
  Email: string;
  CreatedAt: string;
}

export interface AuthResult {
  Token: string;
  User: User;
}

export interface Product {
  Id: string;
  UserId: string;
  Name: string;
  Price: number;
  Stock: number;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface ProductInput {
  Name: string;
  Price: number;
  Stock: number;
}

export interface TransactionItem {
  Id: string;
  ProductId: string;
  ProductName: string;
  Quantity: number;
  PriceAtTransaction: number;
  Subtotal: number;
}

export interface Transaction {
  Id: string;
  UserId: string;
  Type: TransactionType;
  TotalAmount: number;
  Description: string;
  TransactionDate: string;
  CreatedAt: string;
  Items: TransactionItem[];
}

export interface IncomeInput {
  TransactionDate: string;
  Description: string;
  Items: { ProductId: string; Quantity: number }[];
}

export interface ExpenseInput {
  TransactionDate: string;
  Description: string;
  TotalAmount: number;
}

export interface DashboardSummary {
  StartDate: string;
  EndDate: string;
  TotalIncome: number;
  TotalExpense: number;
  NetProfit: number;
}

export interface ProfitLossRow {
  Period: string;
  TotalIncome: number;
  TotalExpense: number;
  NetProfit: number;
}

export interface ProfitLossReport extends DashboardSummary {
  GroupBy: ReportGroupBy;
  Rows: ProfitLossRow[];
}
