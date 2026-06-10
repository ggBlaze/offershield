import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.04] bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
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
            How it works
          </a>
          <a href="#features" className="hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#disclaimer" className="hover:text-foreground transition-colors">
            Disclaimer
          </a>
        </nav>

        <Badge variant="muted" className="hidden sm:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Powered by MiniMax-M3
        </Badge>
      </div>
    </header>
  );
}
