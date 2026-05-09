"use client";

interface ContractInputProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
}

const PLACEHOLDER = `// Paste your Solidity contract here
pragma solidity ^0.8.0;

contract Example {
    address public owner;
    mapping(address => uint256) public balances;

    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount);
        (bool ok,) = msg.sender.call{value: amount}("");
        require(ok);
        balances[msg.sender] -= amount; // Bug: balance updated after transfer
    }
}`;

export function ContractInput({ value, onChange, onAnalyze }: ContractInputProps) {
  const isEmpty = value.trim().length === 0;

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Submit on Cmd+Enter / Ctrl+Enter
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (!isEmpty) onAnalyze();
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-md border border-white/[0.08] bg-black/40 transition-colors focus-within:border-emerald-500/40">
        {/* Editor chrome — filename + char counter */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-3 py-1.5">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
              contract.sol
            </span>
          </div>
          <span className="font-mono text-[10px] tabular-nums text-zinc-600">
            {value.length.toLocaleString()} / 50,000
          </span>
        </div>

        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={PLACEHOLDER}
          spellCheck={false}
          rows={20}
          className="w-full resize-none bg-transparent px-3 py-3 font-mono text-[13px] leading-relaxed text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">
          {isEmpty ? "awaiting_input" : "press ⌘↵ to run"}
        </p>

        <button
          onClick={onAnalyze}
          disabled={isEmpty}
          className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wider text-black transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
        >
          Run Analysis
          <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}
