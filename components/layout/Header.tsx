"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { useLocale } from "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const { t } = useLocale();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.04] bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/30 to-sky-500/30 ring-1 ring-white/10">
            <ShieldCheck className="h-4 w-4 text-indigo-200" />
          </span>
          <span>OfferShield</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#how" className="hover:text-foreground transition-colors">
            {t.nav.howItWorks}
          </a>
          <a
            href="#features"
            className="hover:text-foreground transition-colors"
          >
            {t.nav.features}
          </a>
          <a
            href="#disclaimer"
            className="hover:text-foreground transition-colors"
          >
            {t.nav.disclaimer}
          </a>
        </nav>

        <LanguageSwitcher />
      </div>
    </header>
  );
}
