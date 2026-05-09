import { AnalysisResult as AnalysisResultType, Severity, Vulnerability } from "@/lib/types";

interface Props {
  result: AnalysisResultType;
  onReset: () => void;
}

// Risk score color: green → yellow → red
function scoreText(score: number) {
  if (score >= 70) return "text-red-400";
  if (score >= 40) return "text-yellow-400";
  return "text-emerald-400";
}

// Tailwind needs full class strings present in source for the JIT to pick
// them up, so we keep `text-*` and `bg-*` variants separate.
function scoreBg(score: number) {
  if (score >= 70) return "bg-red-400";
  if (score >= 40) return "bg-yellow-400";
  return "bg-emerald-400";
}

function scoreLabel(score: number) {
  if (score >= 70) return "High Risk";
  if (score >= 40) return "Medium Risk";
  if (score > 0) return "Low Risk";
  return "No Issues Found";
}

const severityText: Record<Severity, string> = {
  critical:      "text-red-400",
  high:          "text-orange-400",
  medium:        "text-yellow-400",
  low:           "text-blue-400",
  informational: "text-zinc-500",
};

const severityBorder: Record<Severity, string> = {
  critical:      "border-l-red-500/60",
  high:          "border-l-orange-500/60",
  medium:        "border-l-yellow-500/60",
  low:           "border-l-blue-500/60",
  informational: "border-l-zinc-500/30",
};

export function AnalysisResult({ result, onReset }: Props) {
  const { vulnerabilities, summary, riskScore, analyzedAt } = result;

  return (
    <div className="flex flex-col gap-4">
      {/* Report metadata row */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-400">
            report
          </span>
          <span className="font-mono text-[10px] text-zinc-600">
            {new Date(analyzedAt).toLocaleString()}
          </span>
        </div>
        <button
          onClick={onReset}
          className="rounded-md border border-white/[0.08] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-zinc-400 transition-colors hover:border-white/20 hover:text-zinc-100"
        >
          New Run
        </button>
      </div>

      {/* Risk score panel */}
      <div className="overflow-hidden rounded-md border border-white/[0.08] bg-black/40">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-3 py-1.5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            risk_score
          </span>
          <span className={`font-mono text-[10px] uppercase tracking-wider ${scoreText(riskScore)}`}>
            {scoreLabel(riskScore)}
          </span>
        </div>
        <div className="px-4 py-4">
          <div className="flex items-baseline gap-2">
            <span
              className={`font-mono text-5xl font-semibold tabular-nums tracking-tight ${scoreText(riskScore)}`}
            >
              {riskScore}
            </span>
            <span className="font-mono text-xs text-zinc-600">/ 100</span>
          </div>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.04]">
            <div
              className={`h-full transition-[width] ${scoreBg(riskScore)}`}
              style={{ width: `${riskScore}%` }}
            />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-zinc-300">{summary}</p>
        </div>
      </div>

      {/* Severity counts */}
      <CountRow vulnerabilities={vulnerabilities} />

      {/* Findings list */}
      {vulnerabilities.length === 0 ? (
        <div className="rounded-md border border-emerald-500/20 bg-emerald-500/[0.04] py-4 text-center">
          <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-400">
            ✓ no_issues_detected
          </span>
        </div>
      ) : (
        <div className="overflow-hidden rounded-md border border-white/[0.08] bg-black/40">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-3 py-1.5">
            <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
              findings
            </span>
            <span className="font-mono text-[10px] text-zinc-600">
              {vulnerabilities.length} total
            </span>
          </div>
          <ul className="divide-y divide-white/[0.06]">
            {vulnerabilities.map((v, i) => (
              <FindingRow key={i} index={i + 1} v={v} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function FindingRow({ index, v }: { index: number; v: Vulnerability }) {
  const idx = String(index).padStart(2, "0");

  return (
    <li
      className={`border-l-2 ${severityBorder[v.severity]} px-4 py-3 transition-colors hover:bg-white/[0.015]`}
    >
      {/* Mono header: [01]  HIGH  L42 */}
      <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider">
        <span className="text-zinc-600">[{idx}]</span>
        <span className={severityText[v.severity]}>{v.severity}</span>
        {v.lineNumber != null && <span className="text-zinc-600">L{v.lineNumber}</span>}
      </div>

      <p className="mt-1.5 text-sm font-medium text-zinc-50">{v.title}</p>
      <p className="mt-1 text-[13px] leading-relaxed text-zinc-400">{v.description}</p>

      <div className="mt-2.5 flex gap-2 rounded-sm border-l-2 border-emerald-500/40 bg-white/[0.02] px-3 py-2">
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-emerald-400">
          fix
        </span>
        <span className="text-[13px] leading-relaxed text-zinc-300">{v.recommendation}</span>
      </div>
    </li>
  );
}

function CountRow({ vulnerabilities }: { vulnerabilities: Vulnerability[] }) {
  if (vulnerabilities.length === 0) return null;

  const order: Severity[] = ["critical", "high", "medium", "low", "informational"];
  const counts = vulnerabilities.reduce(
    (acc, v) => ({ ...acc, [v.severity]: (acc[v.severity] ?? 0) + 1 }),
    {} as Record<Severity, number>
  );

  return (
    <div className="grid grid-cols-5 gap-2">
      {order.map((s) => {
        const n = counts[s] ?? 0;
        const active = n > 0;
        return (
          <div key={s} className="rounded-md border border-white/[0.06] bg-black/40 px-2.5 py-2">
            <p
              className={`font-mono text-[10px] uppercase tracking-wider ${
                active ? severityText[s] : "text-zinc-600"
              }`}
            >
              {s}
            </p>
            <p
              className={`mt-0.5 font-mono text-lg font-semibold tabular-nums ${
                active ? "text-zinc-100" : "text-zinc-700"
              }`}
            >
              {n}
            </p>
          </div>
        );
      })}
    </div>
  );
}
