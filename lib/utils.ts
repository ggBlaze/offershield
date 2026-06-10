import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes safely. Resolves conflicts and dedupes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as a friendly 0–100 risk score label. */
export function formatRiskScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score))).toString();
}

/** Map a numeric 0–100 score to a low/medium/high bucket. */
export function riskBucket(
  score: number,
): "low" | "medium" | "high" {
  if (score < 34) return "low";
  if (score < 67) return "medium";
  return "high";
}

/** Tailwind color tokens for a risk severity. */
export function riskClasses(severity: "low" | "medium" | "high") {
  switch (severity) {
    case "low":
      return {
        badge:
          "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
        dot: "bg-emerald-400",
        border: "border-emerald-500/30",
        text: "text-emerald-300",
        ring: "ring-emerald-500/40",
      };
    case "medium":
      return {
        badge:
          "bg-amber-500/10 text-amber-300 border-amber-500/30",
        dot: "bg-amber-400",
        border: "border-amber-500/30",
        text: "text-amber-300",
        ring: "ring-amber-500/40",
      };
    case "high":
      return {
        badge:
          "bg-rose-500/10 text-rose-300 border-rose-500/30",
        dot: "bg-rose-400",
        border: "border-rose-500/30",
        text: "text-rose-300",
        ring: "ring-rose-500/40",
      };
  }
}

/** Format an ISO-ish date string for display. */
export function formatDate(input: string | null | undefined): string {
  if (!input) return "—";
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return input;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Truncate text to N chars, breaking on whitespace when possible. */
export function truncate(text: string, n: number) {
  if (text.length <= n) return text;
  const cut = text.slice(0, n);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > n * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd() + "…";
}

/** Count approximate words in a string. */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/** Estimate reading time in minutes. */
export function readingTimeMinutes(text: string): number {
  return Math.max(1, Math.round(countWords(text) / 220));
}

/** Pretty file size. */
export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
