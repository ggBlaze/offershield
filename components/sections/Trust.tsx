import { Lock, Server, KeyRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function Trust() {
  return (
    <section className="py-16 border-t border-white/[0.04]">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6 flex items-start gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/20 shrink-0">
                <Lock className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold">Private by default</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  Document text is sent to the model only to generate your
                  report. Nothing is stored.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-start gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-300 ring-1 ring-indigo-500/20 shrink-0">
                <Server className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold">Server-side AI</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  All analysis runs on the server. Your API key, if configured,
                  never reaches the browser.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-start gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-300 ring-1 ring-violet-500/20 shrink-0">
                <KeyRound className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold">No login required</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  Open the app and use it. No account, no email, no friction.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
