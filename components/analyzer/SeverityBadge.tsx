import { Severity } from "@/lib/types";

const styles: Record<Severity, string> = {
  critical:      "border-red-500/30 bg-red-500/10 text-red-400",
  high:          "border-orange-500/30 bg-orange-500/10 text-orange-400",
  medium:        "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
  low:           "border-blue-500/30 bg-blue-500/10 text-blue-400",
  informational: "border-zinc-500/30 bg-zinc-500/10 text-zinc-400",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span
      className={`inline-flex items-center rounded-sm border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${styles[severity]}`}
    >
      {severity}
    </span>
  );
}
