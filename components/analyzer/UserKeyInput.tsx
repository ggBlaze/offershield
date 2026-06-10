"use client";

import * as React from "react";
import { KeyRound, Eye, EyeOff, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n";

/**
 * BYOK — Bring Your Own Key.
 *
 * The user can paste a MiniMax-M3 (`sk-cp-…`) or Anthropic
 * (`sk-ant-…`) key here. The key is saved to localStorage
 * (`offershield:user-api-key`) and read by the Analyzer, which
 * sends it with each /api/analyze request. The server uses it
 * for that one request, then forgets it. It never reaches our
 * logs, our DB (we don't have one), or any third party.
 *
 * If the key is removed, the analyzer falls back to the
 * server-configured key (if any), or to mock mode.
 *
 * All user-visible strings come from the active locale's
 * dictionary so the component feels native in en / es / zh.
 */
const STORAGE_KEY = "offershield:user-api-key";
const KEY_REGEX = /^(sk-|sk-ant-|sk-cp-)[A-Za-z0-9_-]{16,}$/;

function readKey(): string {
  try {
    return (window.localStorage.getItem(STORAGE_KEY) ?? "").trim();
  } catch {
    return "";
  }
}

function writeKey(value: string) {
  try {
    if (value) window.localStorage.setItem(STORAGE_KEY, value);
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

function maskKey(key: string): string {
  if (!key) return "";
  if (key.length <= 12) return "•".repeat(key.length);
  return `${key.slice(0, 7)}…${key.slice(-4)}`;
}

interface UserKeyInputProps {
  /** Compact mode for tight layouts (no card chrome). */
  className?: string;
}

export function UserKeyInput({ className }: UserKeyInputProps) {
  const { t } = useLocale();
  const [open, setOpen] = React.useState(false);
  const [key, setKey] = React.useState("");
  const [draft, setDraft] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  // Load saved key on mount
  React.useEffect(() => {
    const saved = readKey();
    setKey(saved);
    setDraft(saved);
  }, []);

  const handleSave = () => {
    const trimmed = draft.trim();
    if (trimmed && !KEY_REGEX.test(trimmed)) {
      setError(t.analyzer.byok.invalidError);
      return;
    }
    setError(null);
    setKey(trimmed);
    writeKey(trimmed);
    setOpen(false);
  };

  const handleClear = () => {
    setDraft("");
    setKey("");
    writeKey("");
    setError(null);
  };

  return (
    <div className={cn("rounded-lg border border-border bg-white/[0.02]", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs text-muted-foreground hover:text-foreground transition-colors"
        aria-expanded={open}
      >
        <span className="inline-flex items-center gap-1.5">
          <KeyRound className="h-3.5 w-3.5" />
          {key ? (
            <span className="text-foreground/80">
              {t.analyzer.byok.activeLabel(maskKey(key))}
            </span>
          ) : (
            <span>{t.analyzer.byok.collapsedLabel}</span>
          )}
        </span>
        <span className="text-muted-foreground/60">{open ? "▾" : "▸"}</span>
      </button>

      {open && (
        <div className="border-t border-border px-3 py-3 space-y-2">
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t.analyzer.byok.description}
          </p>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type={show ? "text" : "password"}
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value);
                  if (error) setError(null);
                }}
                placeholder={t.analyzer.byok.placeholder}
                autoComplete="off"
                spellCheck={false}
                className={cn(
                  "w-full rounded-md border border-input bg-background/60 px-3 py-1.5 pr-9 text-xs",
                  "font-mono placeholder:text-muted-foreground/60",
                  "focus-ring",
                  error && "border-rose-500/60",
                )}
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                aria-label={show ? t.analyzer.byok.hideKey : t.analyzer.byok.showKey}
              >
                {show ? (
                  <EyeOff className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={draft.trim() === key}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary/90 px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="h-3.5 w-3.5" />
              {t.analyzer.byok.save}
            </button>

            {key && (
              <button
                type="button"
                onClick={handleClear}
                aria-label={t.analyzer.byok.clearAria}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-transparent px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-white/5"
              >
                <X className="h-3.5 w-3.5" />
                {t.analyzer.byok.clear}
              </button>
            )}
          </div>

          {error && <p className="text-xs text-rose-300">{error}</p>}

          <p className="text-[11px] text-muted-foreground/70">
            {t.analyzer.byok.formatNote}
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Read the saved user key from localStorage. Returns an empty
 * string if not set or unavailable. Used by the Analyzer right
 * before issuing each /api/analyze request.
 */
export function getUserApiKey(): string {
  if (typeof window === "undefined") return "";
  return readKey();
}
