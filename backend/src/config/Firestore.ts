import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { Env } from "./Env";

if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: Env.FirebaseProjectId,
      clientEmail: Env.FirebaseClientEmail,
      privateKey: Env.FirebasePrivateKey,
    }),
  });
}

export const db = getFirestore();
db.settings({ ignoreUndefinedProperties: true });

export const Collections = {
  Users: "Users",
  Products: "Products",
  Transactions: "Transactions",
} as const;
