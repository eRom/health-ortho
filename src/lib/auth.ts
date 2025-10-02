import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/integrations/next-js";

import { prisma } from "@/lib/prisma";

type SocialProviders = NonNullable<
  Parameters<typeof betterAuth>[0]["socialProviders"]
>;

function buildSocialProviders(): SocialProviders | undefined {
  const providers: Partial<SocialProviders> = {};

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.google = {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    } as SocialProviders["google"];
  }

  if (
    process.env.APPLE_CLIENT_ID &&
    process.env.APPLE_TEAM_ID &&
    process.env.APPLE_KEY_ID &&
    process.env.APPLE_PRIVATE_KEY
  ) {
    providers.apple = {
      clientId: process.env.APPLE_CLIENT_ID,
      teamId: process.env.APPLE_TEAM_ID,
      keyId: process.env.APPLE_KEY_ID,
      privateKey: process.env.APPLE_PRIVATE_KEY,
    } as SocialProviders["apple"];
  }

  return Object.keys(providers).length
    ? (providers as SocialProviders)
    : undefined;
}

export const auth = betterAuth({
  baseURL:
    process.env.AUTH_BASE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: buildSocialProviders(),
  plugins: [nextCookies()],
});
