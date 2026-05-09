import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-black/60 backdrop-blur-md">
      <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="group flex items-center gap-2">
          <LogoMark />
          <span className="font-mono text-[11px] font-medium tracking-[0.2em] text-zinc-100">
            AUDITOR
          </span>
          <span className="font-mono text-[10px] text-zinc-600">v0.1</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/analyze"
            className="rounded-md px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-zinc-400 transition-colors hover:text-zinc-100"
          >
            Analyze
          </Link>
          <Link
            href="https://github.com"
            className="rounded-md px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-zinc-400 transition-colors hover:text-zinc-100"
          >
            GitHub
          </Link>
          <span className="ml-1 flex items-center gap-1.5 rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-1">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
              online
            </span>
          </span>
        </nav>
      </div>
    </header>
  );
}

function LogoMark() {
  return (
    <div className="flex h-6 w-6 items-center justify-center rounded-md border border-emerald-500/25 bg-emerald-500/[0.06]">
      <svg
        viewBox="0 0 16 16"
        className="h-3.5 w-3.5 text-emerald-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M8 1.5l5.5 2v5c0 3-2.4 5.4-5.5 6-3.1-.6-5.5-3-5.5-6v-5l5.5-2z" />
        <path d="M5.5 8l2 2 3-4" />
      </svg>
    </div>
  );
}
