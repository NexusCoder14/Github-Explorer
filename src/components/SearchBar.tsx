import React from "react";
import { Search, CornerDownLeft, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  isSearching?: boolean;
}

export function SearchBar({ value, onChange, onSearch, isSearching }: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  const handleClear = () => {
    onChange("");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-center">
        <div className="absolute left-4 text-indigo-400 pointer-events-none">
          <Search className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search GitHub repositories (e.g. facebook/react or typescript)..."
          className="glass-input w-full pl-12 pr-28 py-3.5 rounded-xl text-slate-100 placeholder-slate-400 text-sm focus:outline-none transition-all shadow-inner"
        />

        <div className="absolute right-2.5 flex items-center gap-2">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 text-slate-400 hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-800/60"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            disabled={!value.trim() || isSearching}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
          >
            <span>Search</span>
            <CornerDownLeft className="w-3.5 h-3.5 opacity-80" />
          </button>
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-400 flex items-center gap-1">
        <span className="inline-block px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-indigo-300">
          Enter
        </span>
        Press Enter to trigger GitHub API search
      </p>
    </form>
  );
}
