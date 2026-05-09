import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

const DETECTIONS = [
  "Reentrancy attacks",
  "Integer overflow",
  "Access control",
  "Floating pragma",
  "Unchecked calls",
  "Gas optimization",
];

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <Navbar />

      <main className="relative">
        {/* Subtle grid backdrop, faded at the edges */}
        <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade" aria-hidden />

        <section className="relative mx-auto max-w-3xl px-4 pb-20 pt-20 text-center sm:pt-28">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
              Solidity Security · v0.1
            </span>
          </div>

          <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
            Audit Solidity contracts
            <br />
            <span className="text-zinc-500">in seconds.</span>
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-zinc-400">
            AI-driven static analysis for reentrancy, integer overflow, access
            control flaws, and other common exploit vectors.
          </p>

          <div className="mt-8 flex items-center justify-center gap-2">
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-3.5 py-2 font-mono text-[11px] font-medium uppercase tracking-wider text-black transition-colors hover:bg-emerald-400"
            >
              Run Analysis
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="https://github.com"
              className="inline-flex items-center gap-2 rounded-md border border-white/[0.08] bg-white/[0.02] px-3.5 py-2 font-mono text-[11px] font-medium uppercase tracking-wider text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
            >
              View Source
            </Link>
          </div>

          {/* Detection capabilities, framed as a small terminal-style panel */}
          <div className="mx-auto mt-14 max-w-xl overflow-hidden rounded-md border border-white/[0.08] bg-black/40 backdrop-blur">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-3 py-1.5">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                  detected_classes
                </span>
              </div>
              <span className="font-mono text-[10px] text-zinc-600">
                {DETECTIONS.length} / {DETECTIONS.length}
              </span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2">
              {DETECTIONS.map((c, i) => (
                <li
                  key={c}
                  className={`flex items-center gap-2 px-3 py-2 text-left ${
                    i % 2 === 0 ? "sm:border-r sm:border-white/[0.04]" : ""
                  } ${i >= 2 ? "border-t border-white/[0.04]" : ""}`}
                >
                  <span className="font-mono text-[10px] text-emerald-400">✓</span>
                  <span className="font-mono text-xs text-zinc-300">{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
