import { Severity } from "@/lib/types";

const styles: Record<Severity, string> = {
  critical: "bg-red-500/10 text-red-400 ring-red-500/30",
  high:     "bg-orange-500/10 text-orange-400 ring-orange-500/30",
  medium:   "bg-yellow-500/10 text-yellow-400 ring-yellow-500/30",
  low:      "bg-blue-500/10 text-blue-400 ring-blue-500/30",
  informational: "bg-zinc-500/10 text-zinc-400 ring-zinc-500/30",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset capitalize ${styles[severity]}`}
    >
      {severity}
    </span>
  );
}
