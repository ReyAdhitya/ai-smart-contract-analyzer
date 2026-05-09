"use client";

interface ContractInputProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
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

export function ContractInput({ value, onChange, onAnalyze, isLoading }: ContractInputProps) {
  const isEmpty = value.trim().length === 0;

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Submit on Cmd+Enter / Ctrl+Enter
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (!isEmpty && !isLoading) onAnalyze();
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-zinc-300">
          Solidity Contract
        </label>
        <span className="text-xs text-zinc-500">
          {value.length.toLocaleString()} / 50,000 chars
        </span>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={PLACEHOLDER}
        spellCheck={false}
        rows={18}
        className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors"
      />

      <button
        onClick={onAnalyze}
        disabled={isEmpty || isLoading}
        className="flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isLoading ? (
          <>
            <Spinner />
            Analyzing...
          </>
        ) : (
          "Analyze Contract"
        )}
      </button>

      <p className="text-center text-xs text-zinc-600">
        {isEmpty ? "Paste a contract above to get started" : "Press Cmd+Enter to analyze"}
      </p>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
