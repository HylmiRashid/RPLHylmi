import { DocumentReference } from "firebase-admin/firestore";
import { randomUUID } from "crypto";
import { Collections, db } from "../config/Firestore";
import { CreateExpenseDto, CreateIncomeDto } from "../types/Dtos";
import { Product, Transaction, TransactionItem, TransactionType } from "../types/Models";
import { HttpError } from "../utils/HttpError";

const transactions = () => db.collection(Collections.Transactions);
const products = () => db.collection(Collections.Products);

export async function findTransactions(userId: string, startDate?: string, endDate?: string): Promise<Transaction[]> {
  const snapshot = await transactions().where("UserId", "==", userId).get();
  return snapshot.docs
    .map((doc) => doc.data() as Transaction)
    .filter((item) => {
      const date = item.TransactionDate.slice(0, 10);
      return (!startDate || date >= startDate) && (!endDate || date <= endDate);
    })
    .sort((a, b) => b.TransactionDate.localeCompare(a.TransactionDate) || b.CreatedAt.localeCompare(a.CreatedAt));
}

export async function createExpense(userId: string, input: CreateExpenseDto): Promise<Transaction> {
  const transaction: Transaction = {
    Id: randomUUID(),
    UserId: userId,
    Type: TransactionType.Expense,
    TotalAmount: input.TotalAmount,
    Description: input.Description,
    TransactionDate: input.TransactionDate,
    CreatedAt: new Date().toISOString(),
    Items: [],
  };
  await transactions().doc(transaction.Id).set(transaction);
  return transaction;
}

export async function createIncome(userId: string, input: CreateIncomeDto): Promise<Transaction> {
  const quantities = new Map<string, number>();
  for (const item of input.Items) {
    quantities.set(item.ProductId, (quantities.get(item.ProductId) ?? 0) + item.Quantity);
  }
  const transactionRef = transactions().doc(randomUUID());

  return db.runTransaction(async (tx) => {
    const refs = [...quantities.keys()].map((id) => products().doc(id));
    const snapshots = await tx.getAll(...refs);
    const now = new Date().toISOString();
    const items: TransactionItem[] = [];
    const stockUpdates: { Ref: DocumentReference; Stock: number }[] = [];

    for (const snapshot of snapshots) {
      const product = snapshot.data() as Product | undefined;
      if (!product || product.UserId !== userId) {
        throw new HttpError(404, "Produk tidak ditemukan.");
      }
      const quantity = quantities.get(snapshot.id) as number;
      if (product.Stock < quantity) {
        throw new HttpError(400, `Stok ${product.Name} tidak mencukupi. Sisa stok: ${product.Stock}.`);
      }
      items.push({
        Id: randomUUID(),
        ProductId: product.Id,
        ProductName: product.Name,
        Quantity: quantity,
        PriceAtTransaction: product.Price,
        Subtotal: product.Price * quantity,
      });
      stockUpdates.push({ Ref: snapshot.ref, Stock: product.Stock - quantity });
    }

    const transaction: Transaction = {
      Id: transactionRef.id,
      UserId: userId,
      Type: TransactionType.Income,
      TotalAmount: items.reduce((total, item) => total + item.Subtotal, 0),
      Description: input.Description,
      TransactionDate: input.TransactionDate,
      CreatedAt: now,
      Items: items,
    };

    for (const update of stockUpdates) {
      tx.update(update.Ref, { Stock: update.Stock, UpdatedAt: now });
    }
    tx.set(transactionRef, transaction);
    return transaction;
  });
}

export async function deleteTransaction(userId: string, id: string): Promise<void> {
  const ref = transactions().doc(id);

  await db.runTransaction(async (tx) => {
    const snapshot = await tx.get(ref);
    const transaction = snapshot.data() as Transaction | undefined;
    if (!transaction || transaction.UserId !== userId) {
      throw new HttpError(404, "Transaksi tidak ditemukan.");
    }

    if (transaction.Type === TransactionType.Income && transaction.Items.length > 0) {
      const productSnapshots = await tx.getAll(...transaction.Items.map((item) => products().doc(item.ProductId)));
      const now = new Date().toISOString();
      productSnapshots.forEach((productSnapshot, index) => {
        const product = productSnapshot.data() as Product | undefined;
        if (product && product.UserId === userId) {
          tx.update(productSnapshot.ref, { Stock: product.Stock + transaction.Items[index].Quantity, UpdatedAt: now });
        }
      });
    }

    tx.delete(ref);
  });
}
