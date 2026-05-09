"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Scanning for reentrancy...",
  "Checking access control...",
  "Analyzing integer overflow...",
  "Detecting unchecked calls...",
];

const MESSAGE_INTERVAL_MS = 1500;

interface ScanningViewProps {
  code: string;
}

export function ScanningView({ code }: ScanningViewProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setMessageIndex((i) => (i + 1) % MESSAGES.length);
    }, MESSAGE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-md border border-emerald-500/30 bg-black/40">
        {/* Header — mirrors ContractInput's chrome but in scanning state */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-3 py-1.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
              contract.sol
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
            scanning
          </span>
        </div>

        {/* Code body — fixed height container hosts both the code and the
            absolutely positioned scan line so the line sweeps the visible
            window regardless of contract length. */}
        <div className="relative h-[480px] overflow-hidden">
          <pre className="h-full overflow-y-auto px-3 py-3 font-mono text-[13px] leading-relaxed text-zinc-300">
            {code}
          </pre>
          <div className="scan-line" aria-hidden />
        </div>
      </div>

      {/* Cycling status line. The `key` swap on the message span retriggers
          the fade-in animation on every change. */}
      <div className="flex items-center gap-2 px-1">
        <span className="font-mono text-[11px] text-emerald-400">{">"}</span>
        <span
          key={messageIndex}
          className="animate-fade-in font-mono text-[12px] text-zinc-300"
        >
          {MESSAGES[messageIndex]}
        </span>
        <span className="animate-blink font-mono text-[12px] text-emerald-400">▍</span>
      </div>
    </div>
  );
}
