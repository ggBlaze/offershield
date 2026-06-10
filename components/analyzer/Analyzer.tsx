"use client";

import * as React from "react";
import { DocumentInput, type InputTab } from "./DocumentInput";
import { AnalyzingState } from "./AnalyzingState";
import { ErrorState } from "./ErrorState";
import { Report } from "./Report";
import type { SampleDoc } from "@/lib/samples";
import { getSampleById } from "@/lib/samples";
import type { AnalysisPayload } from "@/types/analysis";
import { ANALYZER_EVENTS } from "@/components/sections/Hero";

type Status = "idle" | "uploading" | "analyzing" | "error";

export function Analyzer() {
  const [tab, setTab] = React.useState<InputTab>("paste");
  const [text, setText] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [selectedSampleId, setSelectedSampleId] = React.useState<string | null>(
    null,
  );
  const [status, setStatus] = React.useState<Status>("idle");
  const [result, setResult] = React.useState<AnalysisPayload | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const resultsRef = React.useRef<HTMLDivElement | null>(null);

  const reset = React.useCallback(() => {
    setStatus("idle");
    setError(null);
  }, []);

  const handleSelectSample = React.useCallback((doc: SampleDoc) => {
    setSelectedSampleId(doc.id);
    setText(doc.text);
    setFile(null);
    setResult(null);
    setError(null);
    setStatus("idle");
    setTab("sample");
  }, []);

  const handleFileChange = React.useCallback((f: File | null) => {
    setFile(f);
    if (f) {
      setResult(null);
      setError(null);
      setStatus("idle");
    }
  }, []);

  const handleTextChange = React.useCallback((t: string) => {
    setText(t);
    if (t && selectedSampleId && t !== getSampleById(selectedSampleId)?.text) {
      setSelectedSampleId(null);
    }
    if (result || error) {
      setResult(null);
      setError(null);
      setStatus("idle");
    }
  }, [selectedSampleId, result, error]);

  const handleTabChange = React.useCallback((next: InputTab) => {
    setTab(next);
    setResult(null);
    setError(null);
    setStatus("idle");
  }, []);

  // Listen for cross-component events from the Hero CTAs.
  // NOTE: must come AFTER the useCallback declarations above to avoid a
  // temporal dead zone (ReferenceError) on initial render.
  React.useEffect(() => {
    const onTrySample = (e: Event) => {
      const detail = (e as CustomEvent<{ sampleId: string }>).detail;
      const doc = getSampleById(detail.sampleId);
      if (doc) handleSelectSample(doc);
    };
    const onFocusPaste = () => {
      handleTabChange("paste");
    };
    window.addEventListener(ANALYZER_EVENTS.TRY_SAMPLE, onTrySample);
    window.addEventListener(ANALYZER_EVENTS.FOCUS_PASTE, onFocusPaste);
    return () => {
      window.removeEventListener(ANALYZER_EVENTS.TRY_SAMPLE, onTrySample);
      window.removeEventListener(ANALYZER_EVENTS.FOCUS_PASTE, onFocusPaste);
    };
  }, [handleSelectSample, handleTabChange]);

  const handleAnalyze = React.useCallback(async () => {
    setError(null);

    let textToAnalyze = text.trim();
    let source: "paste" | "pdf" | "sample" = "paste";

    if (tab === "sample" && selectedSampleId) {
      const doc = getSampleById(selectedSampleId);
      if (doc) {
        textToAnalyze = doc.text;
        source = "sample";
      }
    }

    if (tab === "upload" && file) {
      setStatus("uploading");
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/parse-pdf", {
          method: "POST",
          body: fd,
        });
        const data = (await res.json()) as
          | { text: string; pageCount: number }
          | { error: string; message: string };
        if (!res.ok || "error" in data) {
          const msg =
            "message" in data
              ? data.message
              : "Could not read this PDF. Try copying the text in instead.";
          setError(msg);
          setStatus("error");
          return;
        }
        textToAnalyze = data.text;
        source = "pdf";
        setText(data.text);
      } catch (err) {
        setError("Network error while uploading. Please try again.");
        setStatus("error");
        return;
      }
    }

    if (!textToAnalyze || textToAnalyze.length < 100) {
      setError("Please paste at least 100 characters of document text.");
      setStatus("error");
      return;
    }

    setStatus("analyzing");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: textToAnalyze, source }),
      });
      const data = (await res.json()) as
        | { result: AnalysisPayload }
        | { error: string; message?: string; retryable?: boolean };
      if (!res.ok || "error" in data) {
        setError(
          (data as { message?: string }).message ??
            "Something went wrong. Please try again.",
        );
        setStatus("error");
        return;
      }
      setResult(data.result);
      setStatus("idle");
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }, [tab, text, file, selectedSampleId]);

  // Keep result visible while in idle after a successful analysis.

  return (
    <div className="space-y-10">
      <div id="analyzer">
        <DocumentInput
          tab={tab}
          onTabChange={handleTabChange}
          text={text}
          onTextChange={handleTextChange}
          file={file}
          onFileChange={handleFileChange}
          selectedSampleId={selectedSampleId}
          onSelectSample={handleSelectSample}
          onAnalyze={handleAnalyze}
          busy={status === "uploading" || status === "analyzing"}
        />
      </div>

      <div ref={resultsRef} className="min-h-[1px]">
        {status === "analyzing" || status === "uploading" ? (
          <AnalyzingState />
        ) : status === "error" ? (
          <ErrorState
            message={error ?? "Something went wrong."}
            onRetry={() => {
              setError(null);
              setStatus("idle");
            }}
          />
        ) : result ? (
          <Report payload={result} />
        ) : null}
      </div>
    </div>
  );
}
