"use client";

import { useState } from "react";
import { QrCode, RefreshCw, Loader2, Copy, Check, Printer, Download } from "lucide-react";

export default function SettingsPage() {
  const [qrUrl, setQrUrl] = useState("");
  const [img, setImg] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  function printQr() {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Force One Fitness — Check-In QR</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&family=Barlow:wght@400;500&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    @page { size: A4 portrait; margin: 0; }

    html, body {
      width: 210mm;
      min-height: 297mm;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    body {
      background: #0f172a;
      color: #fff;
      font-family: 'Barlow', sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .poster {
      width: 210mm;
      min-height: 297mm;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 40px 40px;
      position: relative;
      overflow: hidden;
      gap: 0;
    }

    /* Ambient glows */
    .glow-top {
      position: absolute;
      top: -80px; left: -80px;
      width: 380px; height: 380px;
      background: radial-gradient(circle, rgba(249,115,22,0.28) 0%, transparent 68%);
      border-radius: 50%;
      pointer-events: none;
    }
    .glow-bottom {
      position: absolute;
      bottom: -80px; right: -80px;
      width: 340px; height: 340px;
      background: radial-gradient(circle, rgba(34,197,94,0.14) 0%, transparent 68%);
      border-radius: 50%;
      pointer-events: none;
    }

    /* Header */
    .logo-mark {
      width: 72px; height: 72px;
      background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
      border-radius: 18px;
      display: flex; align-items: center; justify-content: center;
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 26px; font-weight: 900;
      color: #fff;
      box-shadow: 0 8px 32px rgba(249,115,22,0.55);
      margin-bottom: 18px;
    }

    .gym-name {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 52px; font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #fff;
      line-height: 1;
      text-align: center;
    }

    .gym-sub {
      margin-top: 7px;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.25em;
      color: rgba(255,255,255,0.38);
    }

    /* Divider */
    .divider {
      width: 100%; height: 1px;
      margin: 32px 0;
      background: linear-gradient(90deg,
        transparent 0%,
        rgba(249,115,22,0.4) 20%,
        rgba(249,115,22,0.85) 50%,
        rgba(249,115,22,0.4) 80%,
        transparent 100%
      );
    }

    /* QR block */
    .scan-eyebrow {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 22px; font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.28em;
      color: rgba(255,255,255,0.45);
      margin-bottom: 22px;
    }

    .qr-wrap {
      background: #ffffff;
      padding: 22px;
      border-radius: 24px;
      box-shadow:
        0 0 0 1px rgba(249,115,22,0.25),
        0 0 60px rgba(249,115,22,0.25),
        0 32px 64px rgba(0,0,0,0.6);
    }

    .qr-wrap img {
      display: block;
      width: 260px; height: 260px;
    }

    .check-in-label {
      margin-top: 28px;
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 64px; font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      line-height: 1;
      background: linear-gradient(90deg, #f97316, #fb923c);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .tagline {
      margin-top: 10px;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.22em;
      color: rgba(255,255,255,0.3);
    }

    /* Steps */
    .steps {
      margin-top: 30px;
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: rgba(255,255,255,0.35);
    }

    .step-num {
      width: 28px; height: 28px;
      border-radius: 50%;
      border: 1px solid rgba(249,115,22,0.35);
      background: rgba(249,115,22,0.08);
      display: flex; align-items: center; justify-content: center;
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 14px; font-weight: 700;
      color: rgba(249,115,22,0.9);
    }

    .step-sep {
      width: 28px; height: 1px;
      background: rgba(255,255,255,0.12);
    }

    /* Footer */
    .footer {
      margin-top: 36px;
      width: 100%;
      border-top: 1px solid rgba(255,255,255,0.08);
      padding-top: 22px;
      text-align: center;
    }

    .footer-hours {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 17px; font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: rgba(255,255,255,0.55);
    }

    .footer-address {
      margin-top: 6px;
      font-size: 11px;
      color: rgba(255,255,255,0.22);
      letter-spacing: 0.06em;
    }
  </style>
</head>
<body>
  <div class="poster">
    <div class="glow-top"></div>
    <div class="glow-bottom"></div>

    <div class="logo-mark">F1</div>
    <div class="gym-name">Force One Fitness</div>
    <div class="gym-sub">Ayodhya Bypass &nbsp;·&nbsp; Bhopal, MP</div>

    <div class="divider"></div>

    <div class="scan-eyebrow">Scan to</div>

    <div class="qr-wrap">
      <img src="${img}" alt="Gym check-in QR code" />
    </div>

    <div class="check-in-label">Check In</div>
    <div class="tagline">Train Hard &nbsp;·&nbsp; Transform Faster</div>

    <div class="steps">
      <div class="step">
        <div class="step-num">1</div>
        Open Camera
      </div>
      <div class="step-sep"></div>
      <div class="step">
        <div class="step-num">2</div>
        Scan QR
      </div>
      <div class="step-sep"></div>
      <div class="step">
        <div class="step-num">3</div>
        Allow Location
      </div>
      <div class="step-sep"></div>
      <div class="step">
        <div class="step-num">4</div>
        Done!
      </div>
    </div>

    <div class="footer">
      <div class="footer-hours">Mon – Sat &nbsp;·&nbsp; 5:00 AM – 11:00 AM &nbsp;·&nbsp; Sunday Closed</div>
      <div class="footer-address">near SIRT College, K-Sector, Ayodhya Bypass, Bhopal, Madhya Pradesh 462041</div>
    </div>
  </div>
</body>
</html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 800);
  }

  function saveQr() {
    const a = document.createElement("a");
    a.href = img;
    a.download = "force-one-fitness-qr.png";
    a.click();
  }

  async function rotateQr() {
    setLoading(true);
    const res = await fetch("/api/admin/rotate-qr", { method: "POST" });
    const data = (await res.json()) as { scan_url?: string; qr_png_data_url?: string };
    setLoading(false);
    setQrUrl(data.scan_url ?? "");
    setImg(data.qr_png_data_url ?? "");
  }

  async function copyUrl() {
    if (!qrUrl) return;
    await navigator.clipboard.writeText(qrUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-orange-300">
          Configuration
        </p>
        <h1 className="mt-1 font-barlow-condensed text-4xl font-bold uppercase text-white">
          Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500">Manage QR tokens and gym configuration.</p>
      </div>

      {/* QR section */}
      <div className="max-w-md rounded-2xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-500/10">
          <QrCode className="h-5 w-5 text-orange-400" />
        </div>

        <h2 className="font-barlow-condensed text-2xl font-bold uppercase text-white">QR Token</h2>
        <p className="mt-1.5 text-sm text-slate-400">
          Generate a new QR code for the check-in station. The old code is immediately invalidated.
        </p>

        <div className="mt-4 rounded-xl border border-yellow-400/15 bg-yellow-500/[0.06] px-4 py-3">
          <p className="text-xs leading-relaxed text-yellow-300">
            Rotate the token regularly for security. Members will need to scan the new QR code.
          </p>
        </div>

        <button
          onClick={rotateQr}
          disabled={loading}
          className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 px-5 py-3 font-semibold text-white shadow-[0_4px_16px_rgba(249,115,22,0.3)] transition-all duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating…
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Rotate QR Token
            </>
          )}
        </button>

        {/* QR result */}
        {(qrUrl || img) && (
          <div className="mt-5 space-y-4">
            {img && (
              <div className="space-y-3">
                <div className="flex justify-center">
                  <div className="rounded-2xl border border-white/10 bg-white p-4 shadow-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="QR code for gym check-in" className="h-52 w-52" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={saveQr}
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-slate-200 transition-all duration-200 hover:border-orange-400/30 hover:bg-orange-500/10 hover:text-white"
                  >
                    <Download className="h-4 w-4" />
                    Save PNG
                  </button>
                  <button
                    onClick={printQr}
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-slate-200 transition-all duration-200 hover:border-orange-400/30 hover:bg-orange-500/10 hover:text-white"
                  >
                    <Printer className="h-4 w-4" />
                    Print QR
                  </button>
                </div>
              </div>
            )}

            {qrUrl && (
              <div>
                <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Scan URL
                </p>
                <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
                  <p className="flex-1 break-all text-xs text-slate-400">{qrUrl}</p>
                  <button
                    onClick={copyUrl}
                    className="shrink-0 cursor-pointer rounded-lg border border-white/10 bg-white/[0.04] p-2 transition-colors hover:border-orange-400/30 hover:text-orange-300"
                    aria-label="Copy URL"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
