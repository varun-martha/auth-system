import crypto from "node:crypto";

const HASH_ITERATIONS = 120000;
const HASH_KEY_LENGTH = 64;
const HASH_DIGEST = "sha512";

export async function hashPassword(plainPassword: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(plainPassword, salt, HASH_ITERATIONS, HASH_KEY_LENGTH, HASH_DIGEST)
    .toString("hex");

  return `${salt}:${hash}`;
}

export async function verifyPassword(plainPassword: string, passwordHash: string): Promise<boolean> {
  const [salt, expectedHash] = passwordHash.split(":");

  if (!salt || !expectedHash) {
    return false;
  }

  const actualHash = crypto
    .pbkdf2Sync(plainPassword, salt, HASH_ITERATIONS, HASH_KEY_LENGTH, HASH_DIGEST)
    .toString("hex");

  return crypto.timingSafeEqual(Buffer.from(actualHash), Buffer.from(expectedHash));
}
