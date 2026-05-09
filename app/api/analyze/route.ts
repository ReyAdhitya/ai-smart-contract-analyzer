import { NextRequest, NextResponse } from "next/server";
import { AnalysisResult, AnalysisError, AnalyzeRequest } from "@/lib/types";

// --- Validation ---

const MIN_LENGTH = 10;
const MAX_LENGTH = 50_000; // ~1,500 lines — reasonable contract ceiling

function validateRequest(body: unknown): body is AnalyzeRequest {
  if (typeof body !== "object" || body === null) return false;
  const { contractCode } = body as Record<string, unknown>;
  if (typeof contractCode !== "string") return false;
  if (contractCode.trim().length < MIN_LENGTH) return false;
  if (contractCode.length > MAX_LENGTH) return false;
  return true;
}

// --- Mock data ---
// Realistic example so the UI has something meaningful to render.
// Replace the body of POST with the real analyzeContract() call when ready.

const MOCK_RESULT: AnalysisResult = {
  summary:
    "The contract contains two high-severity vulnerabilities that could lead to loss of funds, and one medium-severity issue related to access control.",
  riskScore: 65,
  analyzedAt: new Date().toISOString(),
  vulnerabilities: [
    {
      title: "Reentrancy Attack",
      severity: "high",
      description:
        "The withdraw() function sends ETH before updating the user's balance. An attacker can re-enter the function recursively and drain the contract.",
      recommendation:
        "Apply the checks-effects-interactions pattern: update balances before making any external calls.",
      lineNumber: 42,
    },
    {
      title: "Integer Overflow",
      severity: "high",
      description:
        "Arithmetic on uint256 without SafeMath or Solidity ^0.8.x overflow checks can wrap around to zero.",
      recommendation:
        "Use Solidity 0.8.x or later (which reverts on overflow by default), or use OpenZeppelin's SafeMath library.",
      lineNumber: 17,
    },
    {
      title: "Missing Access Control on setOwner()",
      severity: "medium",
      description:
        "The setOwner() function lacks an onlyOwner modifier, allowing any address to take ownership of the contract.",
      recommendation: "Add a require(msg.sender == owner) check or use OpenZeppelin's Ownable.",
      lineNumber: 28,
    },
    {
      title: "Floating Pragma",
      severity: "informational",
      description:
        'Using pragma solidity ^0.8.0 allows compilation with any 0.8.x compiler. Different compiler versions may produce different bytecode.',
      recommendation: "Pin to a specific compiler version, e.g. pragma solidity 0.8.20.",
      lineNumber: 1,
    },
  ],
};

// --- Route handler ---

export async function POST(req: NextRequest): Promise<NextResponse<AnalysisResult | AnalysisError>> {
  // Parse body safely — req.json() throws if body is not valid JSON
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  if (!validateRequest(body)) {
    return NextResponse.json(
      {
        error: `Contract code must be a string between ${MIN_LENGTH} and ${MAX_LENGTH} characters.`,
      },
      { status: 422 }
    );
  }

  // TODO: swap mock for real analysis
  // const result = await analyzeContract(body.contractCode);
  const result: AnalysisResult = {
    ...MOCK_RESULT,
    analyzedAt: new Date().toISOString(), // fresh timestamp per request
  };

  return NextResponse.json(result, { status: 200 });
}
