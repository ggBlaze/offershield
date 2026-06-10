import { NextResponse } from "next/server";
import { extractPdfText, PdfParseError } from "@/lib/pdf";
import { clientKeyFromHeaders, takeToken } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 20;

const MAX_BYTES = 4_500_000;

export async function POST(req: Request) {
  const ip = clientKeyFromHeaders(req.headers);
  if (!takeToken(`pdf:${ip}`)) {
    return NextResponse.json(
      { error: "rate_limited", message: "Too many uploads. Please wait a moment." },
      { status: 429 },
    );
  }

  const contentType = req.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("multipart/form-data")) {
    return NextResponse.json(
      { error: "bad_request", message: "Expected a multipart/form-data upload." },
      { status: 400 },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch (err) {
    return NextResponse.json(
      { error: "bad_request", message: "Could not read the upload." },
      { status: 400 },
    );
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "bad_request", message: "No file was provided." },
      { status: 400 },
    );
  }

  if (file.size === 0) {
    return NextResponse.json(
      { error: "empty_file", message: "The selected file is empty." },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      {
        error: "too_large",
        message: "The file is too large. Please keep PDFs under 4.5 MB.",
      },
      { status: 413 },
    );
  }

  if (!file.type.includes("pdf") && !file.name.toLowerCase().endsWith(".pdf")) {
    return NextResponse.json(
      { error: "wrong_type", message: "Please upload a PDF file." },
      { status: 415 },
    );
  }

  try {
    const buffer = await file.arrayBuffer();
    const { text, pageCount } = await extractPdfText(buffer);
    return NextResponse.json({ text, pageCount });
  } catch (err) {
    if (err instanceof PdfParseError) {
      return NextResponse.json(
        { error: err.code, message: err.message },
        { status: err.code === "too_large" ? 413 : 422 },
      );
    }
    console.error("[offershield] pdf parse failed:", err);
    return NextResponse.json(
      {
        error: "parse_failed",
        message: "Could not read this PDF. Try copying the text in instead.",
      },
      { status: 500 },
    );
  }
}
