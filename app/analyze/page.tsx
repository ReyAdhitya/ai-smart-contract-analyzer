"use client";

import { useState } from "react";
import { useAnalyzer } from "@/hooks/useAnalyzer";
import { ContractInput } from "@/components/analyzer/ContractInput";
import { AnalysisResult } from "@/components/analyzer/AnalysisResult";

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
    <main className="min-h-screen bg-zinc-950 px-4 py-12">
      <div className="mx-auto max-w-3xl">

        {/* Page header */}
        <div className="mb-10">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-violet-500" />
            <span className="text-xs font-medium uppercase tracking-widest text-violet-400">
              AI-Powered
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-100">
            Smart Contract Analyzer
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Paste any Solidity contract to detect security vulnerabilities instantly.
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-800/50 bg-red-900/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Main content: show input OR result */}
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

      </div>
    </main>
  );
}
