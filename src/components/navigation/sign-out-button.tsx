"use client";

import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/auth-actions";

interface SignOutButtonProps {
  label: string;
  callbackUrl: string;
}

export function SignOutButton({ label, callbackUrl }: SignOutButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleSignOut() {
    startTransition(async () => {
      const result = await signOutAction({ callbackURL: callbackUrl });
      if (!result.success) {
        console.error("sign-out", result.message);
      }
    });
  }

  return (
    <Button variant="outline" size="sm" onClick={handleSignOut} disabled={isPending}>
      {isPending ? "…" : label}
    </Button>
  );
}
