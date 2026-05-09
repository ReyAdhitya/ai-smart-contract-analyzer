import Anthropic from "@anthropic-ai/sdk";
import { AnalysisResult, Vulnerability, Severity } from "./types";

// Single shared client — instantiated once, reused across requests
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// The prompt instructs Claude to return strict JSON so we can parse it
// reliably. We define the exact shape here to match our Vulnerability type.
const SYSTEM_PROMPT = `You are an expert Solidity smart contract security auditor.

When given a smart contract, analyze it for security vulnerabilities and respond with ONLY valid JSON — no markdown, no explanation outside the JSON.

Use this exact structure:
{
  "vulnerabilities": [
    {
      "title": "string",
      "severity": "critical" | "high" | "medium" | "low" | "informational",
      "description": "string",
      "recommendation": "string",
      "lineNumber": number | null
    }
  ],
  "summary": "string"
}

Severity definitions:
- critical: Can lead to total loss of funds or contract destruction
- high: Significant risk, likely exploitable
- medium: Moderate risk, exploitable under specific conditions
- low: Minor risk or best-practice violation
- informational: No direct risk, but worth noting

If no vulnerabilities are found, return an empty array and say so in the summary.`;

// Calculates a 0–100 risk score from the severity counts.
// Weighted so a single critical finding dominates the score.
function calculateRiskScore(vulnerabilities: Vulnerability[]): number {
  const weights: Record<Severity, number> = {
    critical: 40,
    high: 20,
    medium: 10,
    low: 5,
    informational: 1,
  };

  const raw = vulnerabilities.reduce((sum, v) => sum + weights[v.severity], 0);
  return Math.min(100, raw); // cap at 100
}

// Parses and validates the raw JSON string returned by Claude.
// Throws if the response is malformed so the API route can handle it cleanly.
function parseClaudeResponse(raw: string): Pick<AnalysisResult, "vulnerabilities" | "summary"> {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Claude returned invalid JSON. Please try again.");
  }

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !Array.isArray((parsed as { vulnerabilities?: unknown }).vulnerabilities) ||
    typeof (parsed as { summary?: unknown }).summary !== "string"
  ) {
    throw new Error("Claude response did not match expected shape.");
  }

  return parsed as Pick<AnalysisResult, "vulnerabilities" | "summary">;
}

// Main export — takes raw Solidity code, returns a structured AnalysisResult.
export async function analyzeContract(contractCode: string): Promise<AnalysisResult> {
  const message = await client.messages.create({
    model: "claude-opus-4-6",       // Most capable model for security analysis
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Analyze this Solidity smart contract for security vulnerabilities:\n\n${contractCode}`,
      },
    ],
  });

  // Extract the text content block from Claude's response
  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude.");
  }

  const { vulnerabilities, summary } = parseClaudeResponse(content.text);

  return {
    vulnerabilities,
    summary,
    riskScore: calculateRiskScore(vulnerabilities),
    analyzedAt: new Date().toISOString(),
  };
}
