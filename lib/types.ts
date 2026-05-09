// Severity levels ordered from most to least critical
export type Severity = "critical" | "high" | "medium" | "low" | "informational";

// A single vulnerability found in the contract
export interface Vulnerability {
  title: string;
  severity: Severity;
  description: string;        // What the vulnerability is and why it's dangerous
  recommendation: string;     // How to fix it
  lineNumber?: number;        // Best-effort — Claude may not always identify this
}

// The full result returned from the API after analysis
export interface AnalysisResult {
  vulnerabilities: Vulnerability[];
  summary: string;            // 1-2 sentence plain-English overview
  riskScore: number;          // 0–100, derived from severity counts
  analyzedAt: string;         // ISO 8601 timestamp
}

// Returned by the API route on failure
export interface AnalysisError {
  error: string;
}

// What the client sends to POST /api/analyze
export interface AnalyzeRequest {
  contractCode: string;
}
