import { randomUUID } from "crypto";
import { Collections, db } from "../config/Firestore";
import { ProductDto } from "../types/Dtos";
import { Product } from "../types/Models";
import { HttpError } from "../utils/HttpError";

const products = () => db.collection(Collections.Products);

async function findOwned(userId: string, id: string) {
  const ref = products().doc(id);
  const snapshot = await ref.get();
  const product = snapshot.data() as Product | undefined;
  if (!product || product.UserId !== userId) {
    throw new HttpError(404, "Produk tidak ditemukan.");
  }
  return { Ref: ref, Product: product };
}

export async function listProducts(userId: string): Promise<Product[]> {
  const snapshot = await products().where("UserId", "==", userId).get();
  return snapshot.docs.map((doc) => doc.data() as Product).sort((a, b) => a.Name.localeCompare(b.Name));
}

export async function createProduct(userId: string, input: ProductDto): Promise<Product> {
  const now = new Date().toISOString();
  const product: Product = { Id: randomUUID(), UserId: userId, ...input, CreatedAt: now, UpdatedAt: now };
  await products().doc(product.Id).set(product);
  return product;
}

export async function updateProduct(userId: string, id: string, input: ProductDto): Promise<Product> {
  const { Ref, Product: existing } = await findOwned(userId, id);
  const updated: Product = { ...existing, ...input, UpdatedAt: new Date().toISOString() };
  await Ref.set(updated);
  return updated;
}

export async function deleteProduct(userId: string, id: string): Promise<void> {
  const { Ref } = await findOwned(userId, id);
  await Ref.delete();
}
