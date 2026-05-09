"use client";

import { useState } from "react";
import { useAnalyzer } from "@/hooks/useAnalyzer";
import { ContractInput } from "@/components/analyzer/ContractInput";
import { AnalysisResult } from "@/components/analyzer/AnalysisResult";
import { Navbar } from "@/components/layout/Navbar";

export default function AnalyzePage() {
  const [code, setCode] = useState("");
  const { result, isLoading, error, analyze, reset } = useAnalyzer();

  function handleAnalyze() {
    analyze(code);
  }

  function handleReset() {
    setCode("");
    reset();
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-8">
        {/* Page heading */}
        <div className="mb-5 border-b border-white/[0.06] pb-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-400">
            /analyze
          </span>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-zinc-50">
            Contract Analyzer
          </h1>
          <p className="mt-0.5 text-xs text-zinc-500">
            Paste a Solidity contract to scan for vulnerabilities.
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-md border border-red-500/20 bg-red-500/[0.04] px-3 py-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-red-400">
              err
            </span>
            <span className="text-xs leading-relaxed text-red-300">{error}</span>
          </div>
        )}

        {result ? (
          <AnalysisResult result={result} onReset={handleReset} />
        ) : (
          <ContractInput
            value={code}
            onChange={setCode}
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
          />
        )}
      </main>
    </div>
  );
}
