"use client";

import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { signInAction } from "@/lib/auth-actions";

import { Apple, Chrome, Loader2, Mail } from "lucide-react";

export interface LoginFieldMessages {
  label: string;
  placeholder: string;
}

export interface LoginMessages {
  tagline: string;
  title: string;
  description: string;
  cta: string;
  orLabel: string;
  fields: {
    email: LoginFieldMessages;
    password: LoginFieldMessages;
  };
  errors: {
    credentials: string;
    generic: string;
  };
  providers: {
    google: string;
    apple: string;
  };
  helper: {
    demo: string;
    contact: string;
  };
}

interface LoginFormProps {
  locale: string;
  callbackURL: string;
  contactEmail: string;
  messages: LoginMessages;
}

export function LoginForm({
  locale,
  callbackURL,
  contactEmail,
  messages,
}: LoginFormProps) {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const fallbackUrl = callbackURL || `/${locale}/dashboard`;
  const resolvedCallbackUrl = searchParams.get("callbackUrl") ?? fallbackUrl;

  async function handleCredentialsSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await signInAction({
        email,
        password,
        callbackURL: resolvedCallbackUrl,
        rememberMe: true,
      });

      if (!result.success) {
        setError(result.message ?? messages.errors.credentials);
      }
    });
  }

  const disabled = isPending;

  return (
    <section className="mx-auto flex w-full max-w-md flex-1 flex-col gap-10 px-4 py-16 sm:px-6">
      <Card className="border-border/60 bg-background/80 shadow-lg">
        <CardHeader className="flex flex-col gap-3 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
            {messages.tagline}
          </p>
          <CardTitle className="text-3xl font-semibold text-foreground">
            {messages.title}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {messages.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          <form
            className="flex flex-col gap-4"
            onSubmit={handleCredentialsSubmit}
          >
            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
              <span>{messages.fields.email.label}</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                placeholder={messages.fields.email.placeholder}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="rounded-lg border border-border/60 bg-background px-4 py-3 text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
              <span>{messages.fields.password.label}</span>
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                required
                placeholder={messages.fields.password.placeholder}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="rounded-lg border border-border/60 bg-background px-4 py-3 text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </label>

            {error ? (
              <p
                className="rounded-md border border-destructive/60 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                role="alert"
              >
                {error}
              </p>
            ) : null}

          <Button type="submit" size="lg" disabled={disabled}>
            {disabled ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Mail className="mr-2 h-4 w-4" aria-hidden />
            )}
              {messages.cta}
            </Button>
          </form>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border/60" aria-hidden />
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              {messages.orLabel}
            </span>
            <div className="h-px flex-1 bg-border/60" aria-hidden />
          </div>

          <div className="grid gap-3">
            <Button
              type="button"
              variant="outline"
              className="justify-start"
              disabled={disabled}
              onClick={() => {
                /* TODO: Wire social login with server action */
              }}
            >
              <Chrome className="mr-2 h-4 w-4" aria-hidden />
              {messages.providers.google}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="justify-start"
              disabled={disabled}
              onClick={() => {
                /* TODO: Wire social login with server action */
              }}
            >
              <Apple className="mr-2 h-4 w-4" aria-hidden />
              {messages.providers.apple}
            </Button>
          </div>

          <footer className="flex flex-col gap-2 text-center text-xs text-muted-foreground">
            <p>{messages.helper.demo}</p>
            <a
              href={`mailto:${contactEmail}`}
              className="text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {messages.helper.contact}
            </a>
          </footer>
        </CardContent>
      </Card>
    </section>
  );
}

