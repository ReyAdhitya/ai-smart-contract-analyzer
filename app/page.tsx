import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4">
      <div className="max-w-lg text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-violet-500" />
          <span className="text-xs font-medium uppercase tracking-widest text-violet-400">
            AI-Powered Security
          </span>
        </div>

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-100">
          Smart Contract Analyzer
        </h1>

        <p className="mt-4 text-base leading-relaxed text-zinc-400">
          Detect reentrancy attacks, integer overflows, access control flaws, and more instantly, using Claude AI.
        </p>

        <Link
          href="/analyze"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
        >
          Analyze a Contract
          <span aria-hidden>→</span>
        </Link>
      </div>
    </main>
  );
}
