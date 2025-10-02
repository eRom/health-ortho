import "dotenv/config";

import { webcrypto } from "node:crypto";

import { prisma } from "../src/lib/prisma";

if (typeof globalThis.crypto === "undefined") {
  Object.defineProperty(globalThis, "crypto", {
    value: webcrypto,
    configurable: false,
    enumerable: false,
    writable: false,
  });
}

const DEMO_EMAIL = "romain.ecarnot@gmail.com";
const DEMO_PASSWORD = "mprnantes";
const DEMO_NAME = "Compte démo";

async function seedDemoUser() {
  const [{ betterAuth }, prismaAdapterModule] = await Promise.all([
    import("better-auth"),
    import("better-auth/adapters/prisma"),
  ]);

  const { prismaAdapter } = prismaAdapterModule as {
    prismaAdapter: typeof import("better-auth/adapters/prisma") extends {
      prismaAdapter: infer Fn;
    }
      ? Fn
      : never;
  };

  const secret = process.env.BETTER_AUTH_SECRET;

  if (!secret) {
    throw new Error(
      "BETTER_AUTH_SECRET est requis pour exécuter le seed. Vérifiez votre fichier .env."
    );
  }

  const auth = betterAuth({
    baseURL: process.env.AUTH_BASE_URL ?? "http://localhost:3000",
    secret,
    database: prismaAdapter(prisma, {
      provider: "sqlite",
    }),
    emailAndPassword: {
      enabled: true,
    },
  });

  await prisma.session.deleteMany({
    where: { user: { email: DEMO_EMAIL } },
  });

  await prisma.account.deleteMany({
    where: { user: { email: DEMO_EMAIL } },
  });

  await prisma.user.deleteMany({ where: { email: DEMO_EMAIL } });

  const result = await auth.api.signUpEmail({
    body: {
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      name: DEMO_NAME,
    },
  });

  if (result.error) {
    throw new Error(`Impossible de créer l'utilisateur demo: ${result.error.message}`);
  }

  await prisma.user.update({
    where: { email: DEMO_EMAIL },
    data: {
      emailVerified: true,
      name: DEMO_NAME,
    },
  });

  console.log("✅ Utilisateur demo prêt :", DEMO_EMAIL);
}

seedDemoUser()
  .catch((error) => {
    console.error("❌ Seed échoué", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
