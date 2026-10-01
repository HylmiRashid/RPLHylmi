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
  PasswordHash: string;
  CreatedAt: string;
}

export type PublicUser = Omit<User, "PasswordHash">;

export interface Product {
  Id: string;
  UserId: string;
  Name: string;
  Price: number;
  Stock: number;
  CreatedAt: string;
  UpdatedAt: string;
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

export interface JwtPayload {
  UserId: string;
}
