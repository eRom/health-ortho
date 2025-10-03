"use client";

import { Loader2, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/auth-actions";

interface UserMenuProps {
  userName: string;
  userEmail: string;
  locale: string;
  messages: {
    profile: string;
    logout: string;
  };
}

export function UserMenu({
  userName,
  userEmail,
  locale,
  messages,
}: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSignOut() {
    startTransition(async () => {
      await signOutAction({ callbackURL: `/${locale}` });
    });
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-border/60 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent/40 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <User className="h-4 w-4" aria-hidden="true" />
        <span className="max-w-[120px] truncate">{userName}</span>
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-full z-50 mt-2 flex min-w-[200px] flex-col gap-1 rounded-xl border border-border/60 bg-background/95 p-2 shadow-lg backdrop-blur">
          <div className="px-3 py-2 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">{userName}</p>
            <p className="truncate">{userEmail}</p>
          </div>

          <div className="h-px bg-border/60" />

          <Link
            href={`/${locale}/profil`}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent/40 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => setIsOpen(false)}
          >
            <User className="h-4 w-4" aria-hidden="true" />
            {messages.profile}
          </Link>

          <div className="h-px bg-border/60" />

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            disabled={isPending}
            className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            {messages.logout}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

