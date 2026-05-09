import { AnalysisResult as AnalysisResultType } from "@/lib/types";
import { SeverityBadge } from "./SeverityBadge";

interface Props {
  result: AnalysisResultType;
  onReset: () => void;
}

// Risk score color: green → yellow → red
function scoreColor(score: number) {
  if (score >= 70) return "text-red-400";
  if (score >= 40) return "text-yellow-400";
  return "text-emerald-400";
}

function scoreLabel(score: number) {
  if (score >= 70) return "High Risk";
  if (score >= 40) return "Medium Risk";
  if (score > 0)   return "Low Risk";
  return "No Issues Found";
}

export function AnalysisResult({ result, onReset }: Props) {
  const { vulnerabilities, summary, riskScore, analyzedAt } = result;

  return (
    <div className="flex flex-col gap-6">

      {/* Header row */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">Analysis Report</h2>
          <p className="mt-0.5 text-xs text-zinc-500">
            {new Date(analyzedAt).toLocaleString()}
          </p>
        </div>
        <button
          onClick={onReset}
          className="shrink-0 rounded-md border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-200"
        >
          New Analysis
        </button>
      </div>

      {/* Risk score card */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">Risk Score</p>
        <div className="mt-1 flex items-end gap-3">
          <span className={`text-5xl font-bold tabular-nums ${scoreColor(riskScore)}`}>
            {riskScore}
          </span>
          <span className={`mb-1 text-sm font-medium ${scoreColor(riskScore)}`}>
            / 100 — {scoreLabel(riskScore)}
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">{summary}</p>
      </div>

      {/* Vulnerability count pills */}
      <VulnerabilityCounts vulnerabilities={vulnerabilities} />

      {/* Vulnerability list */}
      {vulnerabilities.length === 0 ? (
        <div className="rounded-lg border border-emerald-800/40 bg-emerald-900/10 p-6 text-center">
          <p className="text-sm font-medium text-emerald-400">No vulnerabilities detected.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {vulnerabilities.map((v, i) => (
            <li
              key={i}
              className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 transition-colors hover:border-zinc-700"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium text-zinc-100">{v.title}</p>
                <SeverityBadge severity={v.severity} />
              </div>

              {v.lineNumber != null && (
                <p className="mt-1 font-mono text-xs text-zinc-500">Line {v.lineNumber}</p>
              )}

              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{v.description}</p>

              <div className="mt-3 rounded-md bg-zinc-800/60 px-3 py-2">
                <p className="text-xs font-medium text-zinc-400">Recommendation</p>
                <p className="mt-0.5 text-sm text-zinc-300">{v.recommendation}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Small pill summary of severity counts
function VulnerabilityCounts({ vulnerabilities }: { vulnerabilities: AnalysisResultType["vulnerabilities"] }) {
  const counts = vulnerabilities.reduce(
    (acc, v) => ({ ...acc, [v.severity]: (acc[v.severity] ?? 0) + 1 }),
    {} as Record<string, number>
  );

  const order = ["critical", "high", "medium", "low", "informational"] as const;

  return (
    <div className="flex flex-wrap gap-2">
      {order.map((s) =>
        counts[s] ? (
          <span
            key={s}
            className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-300"
          >
            {counts[s]} {s}
          </span>
        ) : null
      )}
    </div>
  );
}
