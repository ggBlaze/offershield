import { ShieldCheck } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/[0.04] mt-20">
      <div className="container py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500/30 to-sky-500/30 ring-1 ring-white/10">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-200" />
          </span>
          <span>© {year} OfferShield</span>
        </div>

        <p className="text-sm text-muted-foreground">
          Built with <span className="text-rose-300">♥</span> using{" "}
          <span className="font-medium text-foreground">MiniMax-M3</span>
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <a href="#how" className="hover:text-foreground transition-colors">
            How it works
          </a>
          <a href="#disclaimer" className="hover:text-foreground transition-colors">
            Disclaimer
          </a>
          <a
            href="/api/health"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Status
          </a>
        </div>
      </div>
    </footer>
  );
}
