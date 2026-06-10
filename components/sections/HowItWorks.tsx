import { ClipboardPaste, Sparkles, FileSearch } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const STEPS = [
  {
    icon: ClipboardPaste,
    title: "Paste or upload",
    body: "Drop in a contract, offer letter, NDA, or any document — text or PDF. Or try a built-in sample.",
  },
  {
    icon: Sparkles,
    title: "Click analyze",
    body: "OfferShield reads the document, identifies key clauses, and surfaces risks in a few seconds.",
  },
  {
    icon: FileSearch,
    title: "Read your report",
    body: "Get a plain-English explanation, red flags, obligations, and questions to ask before signing.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-20 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            How it works
          </p>
          <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight text-balance">
            Three steps. About a minute.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <Card key={i}>
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Step {i + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed text-pretty">
                    {step.body}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
