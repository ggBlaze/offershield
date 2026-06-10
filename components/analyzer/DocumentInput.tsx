"use client";

import * as React from "react";
import {
  ClipboardPaste,
  FileUp,
  Sparkles,
  Upload,
  File as FileIcon,
  X,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SampleChips } from "./SampleChips";
import { SAMPLE_DOCS, type SampleDoc } from "@/lib/samples";
import { cn, countWords, formatBytes, readingTimeMinutes } from "@/lib/utils";
import { useLocale } from "@/lib/i18n";

const MIN_CHARS = 100;
const MAX_CHARS = 25_000;

export type InputTab = "paste" | "upload" | "sample";

export interface DocumentInputProps {
  tab: InputTab;
  onTabChange: (t: InputTab) => void;
  text: string;
  onTextChange: (t: string) => void;
  file: File | null;
  onFileChange: (f: File | null) => void;
  selectedSampleId: string | null;
  onSelectSample: (doc: SampleDoc) => void;
  onAnalyze: () => void;
  busy: boolean;
}

export function DocumentInput({
  tab,
  onTabChange,
  text,
  onTextChange,
  file,
  onFileChange,
  selectedSampleId,
  onSelectSample,
  onAnalyze,
  busy,
}: DocumentInputProps) {
  const { t } = useLocale();
  const [dragOver, setDragOver] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const charCount = text.length;
  const tooShort = charCount > 0 && charCount < MIN_CHARS;
  const tooLong = charCount > MAX_CHARS;
  // The "Analyze" button is enabled when:
  //  - the paste tab has valid text length, OR
  //  - the upload tab has a file selected, OR
  //  - the sample tab has a sample selected
  // (and we're not already busy)
  const pasteReady = charCount >= MIN_CHARS && charCount <= MAX_CHARS;
  const uploadReady = !!file;
  const sampleReady = !!selectedSampleId;
  const tabReady =
    tab === "paste" ? pasteReady : tab === "upload" ? uploadReady : sampleReady;
  const canAnalyze = tabReady && !busy;

  const handleFile = React.useCallback(
    (f: File | null) => {
      setUploadError(null);
      if (!f) {
        onFileChange(null);
        return;
      }
      if (!f.name.toLowerCase().endsWith(".pdf") && !f.type.includes("pdf")) {
        setUploadError(t.analyzer.upload.wrongType);
        return;
      }
      if (f.size > 4.5 * 1024 * 1024) {
        setUploadError(t.analyzer.upload.tooLarge);
        return;
      }
      onFileChange(f);
    },
    [onFileChange, t.analyzer.upload.wrongType, t.analyzer.upload.tooLarge],
  );

  return (
    <div className="rounded-2xl border border-border card-glow bg-card overflow-hidden">
      <div className="p-6 md:p-8">
        <Tabs value={tab} onValueChange={(v) => onTabChange(v as InputTab)}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <TabsList>
              <TabsTrigger value="paste">
                <ClipboardPaste className="h-3.5 w-3.5" />
                {t.analyzer.tabs.paste}
              </TabsTrigger>
              <TabsTrigger value="upload">
                <FileUp className="h-3.5 w-3.5" />
                {t.analyzer.tabs.upload}
              </TabsTrigger>
              <TabsTrigger value="sample">
                <Sparkles className="h-3.5 w-3.5" />
                {t.analyzer.tabs.sample}
              </TabsTrigger>
            </TabsList>
            <p className="text-xs text-muted-foreground">{t.analyzer.trust}</p>
          </div>

          {/* Paste */}
          <TabsContent value="paste">
            <div className="space-y-3">
              <Textarea
                value={text}
                onChange={(e) => onTextChange(e.target.value)}
                placeholder={t.analyzer.paste.placeholder}
                rows={12}
                className="font-mono text-[13px] leading-relaxed"
                disabled={busy}
                aria-label={t.analyzer.tabs.paste}
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {charCount > 0
                    ? t.analyzer.paste.charCounterWithMeta(
                        charCount,
                        MAX_CHARS,
                        countWords(text),
                        readingTimeMinutes(text),
                      )
                    : t.analyzer.paste.charCounter(charCount, MAX_CHARS)}
                </span>
                {tooShort && (
                  <span className="text-amber-300">
                    {t.analyzer.paste.tooShort(MIN_CHARS)}
                  </span>
                )}
                {tooLong && (
                  <span className="text-rose-300">
                    {t.analyzer.paste.tooLong(MAX_CHARS)}
                  </span>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Upload */}
          <TabsContent value="upload">
            <div className="space-y-3">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const f = e.dataTransfer.files?.[0] ?? null;
                  handleFile(f);
                }}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center cursor-pointer transition-colors focus-ring",
                  dragOver
                    ? "border-primary/60 bg-primary/5"
                    : "border-border bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20",
                  busy && "opacity-60 pointer-events-none",
                )}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  className="hidden"
                  onChange={(e) =>
                    handleFile(e.target.files?.[0] ?? null)
                  }
                />
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Upload className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {file
                      ? t.analyzer.upload.replace
                      : t.analyzer.upload.dropZone}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t.analyzer.upload.hint}
                  </p>
                </div>
              </div>

              {uploadError && (
                <p className="text-sm text-rose-300">{uploadError}</p>
              )}

              {file && (
                <div className="flex items-center justify-between rounded-lg border border-border bg-white/[0.03] px-3 py-2.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatBytes(file.size)} · PDF
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleFile(null)}
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5"
                    aria-label={t.analyzer.upload.removeFile}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Sample */}
          <TabsContent value="sample">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {t.analyzer.sample.prompt}
              </p>
              <SampleChips
                onSelect={onSelectSample}
                selectedId={selectedSampleId}
                disabled={busy}
              />
              {text && selectedSampleId && (
                <p className="text-xs text-muted-foreground">
                  {t.analyzer.sample.loaded}
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-border bg-white/[0.015] px-6 md:px-8 py-4">
        <p className="text-xs text-muted-foreground">{t.analyzer.inline}</p>
        <Button
          size="lg"
          variant="gradient"
          onClick={onAnalyze}
          disabled={!canAnalyze}
          className="min-w-[180px]"
        >
          {busy ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-white/80 animate-pulse-soft" />
              {t.analyzer.button.analyzing}
            </span>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              {t.analyzer.button.analyze}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
