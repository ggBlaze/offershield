"use client";

import { ShieldCheck } from "lucide-react";
import { useLocale } from "@/lib/i18n";

export function Footer() {
  const { t } = useLocale();
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/[0.04] mt-20">
      <div className="container py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500/30 to-sky-500/30 ring-1 ring-white/10">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-200" />
          </span>
          <span>{t.footer.copyright(year)}</span>
        </div>

        <p className="text-sm text-muted-foreground">
          {t.footer.builtWith}{" "}
          <span className="text-rose-300">♥</span> {t.footer.using}{" "}
          <span className="font-medium text-foreground">{t.footer.model}</span>
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <a href="#how" className="hover:text-foreground transition-colors">
            {t.nav.howItWorks}
          </a>
          <a
            href="#disclaimer"
            className="hover:text-foreground transition-colors"
          >
            {t.nav.disclaimer}
          </a>
          <a
            href="/api/health"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            {t.nav.status}
          </a>
        </div>
      </div>
    </footer>
  );
}
