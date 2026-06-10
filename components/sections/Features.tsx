import {
  FileText,
  AlertTriangle,
  CalendarDays,
  HelpCircle,
  Layers,
  Lock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const FEATURES = [
  {
    icon: FileText,
    title: "Plain-English explanations",
    body: "Get a calm walkthrough of what the document actually does — no legal jargon required.",
  },
  {
    icon: AlertTriangle,
    title: "Risk flags you can act on",
    body: "Color-coded severity for every concern, with the specific clause it came from.",
  },
  {
    icon: CalendarDays,
    title: "Key dates & obligations",
    body: "Deadlines, renewal triggers, and what each party owes — extracted and laid out clearly.",
  },
  {
    icon: HelpCircle,
    title: "Smart questions to ask",
    body: "A copyable list of specific, useful questions for the other side or your lawyer.",
  },
  {
    icon: Layers,
    title: "Multiple document types",
    body: "Offer letters, freelance contracts, NDAs, SaaS terms, vendor agreements, and more.",
  },
  {
    icon: Lock,
    title: "Private by default",
    body: "Your document text is used only to generate your report. Nothing is stored.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            What you get
          </p>
          <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight text-balance">
            Built to help you make better decisions.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <Card key={i} className="hover:border-white/15 transition-colors">
                <CardContent className="p-6">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] text-foreground ring-1 ring-white/10 mb-4">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-base font-semibold tracking-tight">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed text-pretty">
                    {f.body}
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
