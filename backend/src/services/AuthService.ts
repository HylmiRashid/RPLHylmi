import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import { Env } from "../config/Env";
import { Collections, db } from "../config/Firestore";
import { LoginDto, RegisterDto } from "../types/Dtos";
import { PublicUser, User } from "../types/Models";
import { HttpError } from "../utils/HttpError";

interface AuthResult {
  Token: string;
  User: PublicUser;
}

function toPublicUser(user: User): PublicUser {
  const { PasswordHash: _passwordHash, ...publicUser } = user;
  return publicUser;
}

function signToken(userId: string): string {
  return jwt.sign({ UserId: userId }, Env.JwtSecret, { expiresIn: Env.JwtExpiresIn as jwt.SignOptions["expiresIn"] });
}

async function findByEmail(email: string): Promise<User | null> {
  const snapshot = await db.collection(Collections.Users).where("Email", "==", email).limit(1).get();
  return snapshot.empty ? null : (snapshot.docs[0].data() as User);
}

export async function register(input: RegisterDto): Promise<AuthResult> {
  if (await findByEmail(input.Email)) {
    throw new HttpError(409, "Email sudah terdaftar.");
  }
  const user: User = {
    Id: randomUUID(),
    Name: input.Name,
    StoreName: input.StoreName,
    Email: input.Email,
    PasswordHash: await bcrypt.hash(input.Password, 10),
    CreatedAt: new Date().toISOString(),
  };
  await db.collection(Collections.Users).doc(user.Id).set(user);
  return { Token: signToken(user.Id), User: toPublicUser(user) };
}

export async function login(input: LoginDto): Promise<AuthResult> {
  const user = await findByEmail(input.Email);
  const isValid = user !== null && (await bcrypt.compare(input.Password, user.PasswordHash));
  if (!user || !isValid) {
    throw new HttpError(401, "Email atau kata sandi salah.");
  }
  return { Token: signToken(user.Id), User: toPublicUser(user) };
}
