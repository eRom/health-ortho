"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

interface SignInCredentials {
  email: string;
  password: string;
  callbackURL?: string;
  rememberMe?: boolean;
}

type SameSite = "strict" | "lax" | "none";

interface ParsedCookie {
  name: string;
  value: string;
  path?: string;
  domain?: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: SameSite;
  maxAge?: number;
  expires?: Date;
}

function parseSetCookie(setCookie: string): ParsedCookie | null {
  const parts = setCookie.split(";").map((part) => part.trim());
  const [nameValue, ...attributes] = parts;

  if (!nameValue || !nameValue.includes("=")) {
    return null;
  }

  const [rawName, ...rawValue] = nameValue.split("=");
  const name = rawName.trim();
  const value = rawValue.join("=");

  if (!name) {
    return null;
  }

  const cookie: ParsedCookie = { name, value };

  for (const attribute of attributes) {
    if (!attribute) continue;
    const [key, ...rest] = attribute.split("=");
    const attrName = key.trim().toLowerCase();
    const attrValue = rest.join("=").trim();

    switch (attrName) {
      case "path":
        cookie.path = attrValue;
        break;
      case "domain":
        cookie.domain = attrValue;
        break;
      case "max-age": {
        const maxAge = Number(attrValue);
        if (!Number.isNaN(maxAge)) {
          cookie.maxAge = maxAge;
        }
        break;
      }
      case "expires": {
        const expires = new Date(attrValue);
        if (!Number.isNaN(expires.getTime())) {
          cookie.expires = expires;
        }
        break;
      }
      case "secure":
        cookie.secure = true;
        break;
      case "httponly":
        cookie.httpOnly = true;
        break;
      case "samesite":
        if (attrValue) {
          const sameSite = attrValue.toLowerCase() as SameSite;
          if (sameSite === "strict" || sameSite === "lax" || sameSite === "none") {
            cookie.sameSite = sameSite;
          }
        }
        break;
      default:
        break;
    }
  }

  return cookie;
}

export async function signInAction({
  email,
  password,
  callbackURL,
  rememberMe = true,
}: SignInCredentials) {
  const headerList = await headers();
  const cookieStore = await cookies();

  const cookieHeader = headerList.get("cookie") ?? "";
  const userAgentHeader = headerList.get("user-agent") ?? undefined;

  const response = await auth.api.signInEmail({
    body: {
      email,
      password,
      callbackURL,
      rememberMe,
    },
    headers: {
      cookie: cookieHeader,
      ...(userAgentHeader ? { "user-agent": userAgentHeader } : {}),
    },
    returnHeaders: true,
  });

  if ("error" in response && response.error) {
    const message =
      typeof response.error === "object" && response.error && "message" in response.error
        ? String(response.error.message)
        : null;
    return {
      success: false,
      message: message ?? "Identifiants invalides",
    } as const;
  }

  const { headers: responseHeaders, response: payload } = response;
  const setCookieHeader = responseHeaders.getSetCookie?.();
  if (Array.isArray(setCookieHeader)) {
    for (const cookieValue of setCookieHeader) {
      const parsed = parseSetCookie(cookieValue);
      if (parsed) {
        cookieStore.set(parsed.name, parsed.value, {
          path: parsed.path,
          domain: parsed.domain,
          httpOnly: parsed.httpOnly,
          secure: parsed.secure,
          sameSite: parsed.sameSite,
          maxAge: parsed.maxAge,
          expires: parsed.expires,
        });
      }
    }
  }

  if (payload.redirect && payload.url) {
    redirect(payload.url);
  }

  return { success: true } as const;
}

export async function signOutAction({
  callbackURL,
}: {
  callbackURL: string;
}) {
  const headerList = await headers();
  const cookieStore = await cookies();

  const cookieHeader = headerList.get("cookie") ?? "";
  const userAgentHeader = headerList.get("user-agent") ?? undefined;

  const response = await auth.api.signOut({
    headers: {
      cookie: cookieHeader,
      ...(userAgentHeader ? { "user-agent": userAgentHeader } : {}),
    },
    returnHeaders: true,
  });

  if ("error" in response && response.error) {
    const message =
      typeof response.error === "object" && response.error && "message" in response.error
        ? String(response.error.message)
        : null;
    return {
      success: false,
      message: message ?? "Impossible de se déconnecter",
    } as const;
  }

  const { headers: responseHeaders } = response;
  const setCookieHeader = responseHeaders.getSetCookie?.();
  if (Array.isArray(setCookieHeader)) {
    for (const cookieValue of setCookieHeader) {
      const parsed = parseSetCookie(cookieValue);
      if (parsed) {
        cookieStore.set(parsed.name, parsed.value, {
          path: parsed.path,
          domain: parsed.domain,
          httpOnly: parsed.httpOnly,
          secure: parsed.secure,
          sameSite: parsed.sameSite,
          maxAge: parsed.maxAge,
          expires: parsed.expires,
        });
      }
    }
  }

  redirect(callbackURL);
}

