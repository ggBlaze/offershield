"use client";

import { SAMPLE_DOCS, type SampleDoc } from "@/lib/samples";
import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";

interface SampleChipsProps {
  onSelect: (doc: SampleDoc) => void;
  selectedId?: string | null;
  disabled?: boolean;
}

export function SampleChips({
  onSelect,
  selectedId,
  disabled,
}: SampleChipsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {SAMPLE_DOCS.map((doc) => {
        const active = doc.id === selectedId;
        return (
          <button
            key={doc.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(doc)}
            className={cn(
              "group text-left rounded-xl border bg-white/[0.02] p-4 transition-all focus-ring",
              "hover:bg-white/[0.04] hover:border-white/15",
              active && "border-primary/50 bg-primary/5",
              disabled && "opacity-50 cursor-not-allowed",
            )}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-md",
                  active
                    ? "bg-primary/15 text-primary"
                    : "bg-white/[0.04] text-muted-foreground group-hover:text-foreground",
                )}
              >
                <FileText className="h-3.5 w-3.5" />
              </span>
              <span className="text-sm font-medium">{doc.label}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {doc.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
