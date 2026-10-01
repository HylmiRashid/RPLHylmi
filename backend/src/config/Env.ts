import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variabel lingkungan ${name} belum diisi. Salin .env.example menjadi .env lalu isi nilainya.`);
  }
  return value;
}

export const Env = {
  Port: Number(process.env.PORT ?? 4000),
  CorsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  JwtSecret: required("JWT_SECRET"),
  JwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  FirebaseProjectId: required("FIREBASE_PROJECT_ID"),
  FirebaseClientEmail: required("FIREBASE_CLIENT_EMAIL"),
  FirebasePrivateKey: required("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
};
