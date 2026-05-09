# AI Smart Contract Analyzer

A web application that audits Solidity smart contracts for security vulnerabilities using Anthropic's Claude AI. Paste a contract, get back a structured report covering reentrancy attacks, access control flaws, integer overflows, and other common exploit vectors — along with a 0–100 risk score and concrete remediation advice for each finding.

**Live demo:** [ai-smart-contract-analyzer-r8ckkv10q-reys-projects-3a73006b.vercel.app](https://ai-smart-contract-analyzer-r8ckkv10q-reys-projects-3a73006b.vercel.app)

---

## Features

- **AI-powered vulnerability detection** — Uses Claude as a security auditor with a strict system prompt that returns structured JSON findings.
- **Severity classification** — Each finding is tagged `critical`, `high`, `medium`, `low`, or `informational`, with a description, recommendation, and best-effort line number.
- **Weighted risk score** — A 0–100 score derived from severity counts, weighted so a single critical finding meaningfully impacts the score.
- **Robust input validation** — Server-side checks on contract length (10–50,000 characters) with clear `400` / `422` error responses.
- **Type-safe end to end** — Shared `AnalysisResult`, `Vulnerability`, and `Severity` types across the API route, the Claude client, and the React UI.
- **Modern UI** — Dark-themed, responsive interface built with Tailwind CSS v4 and the Next.js App Router.

---

## Tech Stack

| Layer        | Technology                                  |
|--------------|---------------------------------------------|
| Framework    | Next.js 16 (App Router) + React 19          |
| Language     | TypeScript                                  |
| Styling      | Tailwind CSS v4                             |
| AI           | Anthropic Claude API (`@anthropic-ai/sdk`)  |
| Hosting      | Vercel                                      |

---

## Architecture

```
app/
├── page.tsx                  Landing page
├── analyze/page.tsx          Analyzer UI (client component)
└── api/analyze/route.ts      POST endpoint — validates input and calls Claude

lib/
├── claude.ts                 Claude client, system prompt, response parser, risk score
└── types.ts                  Shared types

components/analyzer/          UI components (ContractInput, AnalysisResult, SeverityBadge)
hooks/useAnalyzer.ts          Client hook managing fetch state
```

The API route validates the request, forwards the contract to Claude with a strict JSON-only system prompt, parses and validates the response shape, and computes a weighted risk score before returning the result.

---

## Getting Started

### Prerequisites

- Node.js 20+
- An Anthropic API key ([console.anthropic.com](https://console.anthropic.com/))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/ai-smart-contract-analyzer.git
cd ai-smart-contract-analyzer

# 2. Install dependencies
npm install

# 3. Set your API key
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local

# 4. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command         | Description                          |
|-----------------|--------------------------------------|
| `npm run dev`   | Start the dev server                 |
| `npm run build` | Build the production bundle          |
| `npm start`     | Run the production build             |
| `npm run lint`  | Lint the codebase with ESLint        |

---

## Roadmap

- **Wire the live Claude integration into the API route** — `lib/claude.ts` is implemented; swap the mock response in `app/api/analyze/route.ts` for `analyzeContract()`.
- **Syntax-highlighted code viewer** — Render the analyzed contract with line numbers and inline severity markers.
- **Per-finding code excerpts** — Show the offending snippet next to each vulnerability.
- **Upload `.sol` files** — Drag-and-drop in addition to the paste flow.
- **Multi-file contract support** — Resolve imports and analyze entire projects, not single files.
- **Exportable reports** — PDF / Markdown export for sharing audit results.
- **Rate limiting** — Per-IP throttling to control API costs.
- **Result caching** — Hash-based cache so identical contracts skip re-analysis.
- **Authentication and history** — Save past analyses per user.

---

## License

MIT
