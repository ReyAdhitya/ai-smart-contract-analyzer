"use client";

import { useState } from "react";
import { AnalysisResult } from "@/lib/types";

interface AnalyzerState {
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
}

// Manages all async state for the contract analysis flow.
// The page component stays clean — it just calls analyze() and reads state.
export function useAnalyzer() {
  const [state, setState] = useState<AnalyzerState>({
    result: null,
    isLoading: false,
    error: null,
  });

  async function analyze(contractCode: string) {
    setState({ result: null, isLoading: true, error: null });

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        // API returned a structured error
        setState({ result: null, isLoading: false, error: data.error ?? "Analysis failed." });
        return;
      }

      setState({ result: data, isLoading: false, error: null });
    } catch {
      // Network failure or JSON parse error
      setState({ result: null, isLoading: false, error: "Could not reach the server. Please try again." });
    }
  }

  function reset() {
    setState({ result: null, isLoading: false, error: null });
  }

  return { ...state, analyze, reset };
}
