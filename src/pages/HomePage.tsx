import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchRepositories, type Repository } from "../services/github";
import { SearchBar } from "../components/SearchBar";
import { RepositoryCard } from "../components/RepositoryCard";
import { Sparkles, TrendingUp, SlidersHorizontal } from "lucide-react";

const SUGGESTIONS = [
  "facebook/react",
  "vercel/next.js",
  "torvalds/linux",
  "microsoft/vscode",
  "tailwindlabs/tailwindcss",
  "vibe-coding",
];

type SortOption = "best-match" | "stars" | "forks" | "updated";

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export function HomePage() {
  const [inputQuery, setInputQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("best-match");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["search", submittedQuery],
    queryFn: () => searchRepositories(submittedQuery),
    enabled: submittedQuery.trim().length > 0,
    staleTime: 1000 * 60 * 5, // Cache for 5 mins
  });

  const handleSearchTrigger = (queryToSearch: string) => {
    const trimmed = queryToSearch.trim();
    if (!trimmed) return;
    setInputQuery(trimmed);
    setSubmittedQuery(trimmed);
  };

  const handleSuggestionClick = (query: string) => {
    handleSearchTrigger(query);
  };

  const availableLanguages = useMemo(() => {
    if (!data?.items) return [];
    const langs = new Set<string>();
    data.items.forEach((repo) => {
      if (repo.language) langs.add(repo.language);
    });
    return Array.from(langs).sort();
  }, [data]);

  const processedRepositories = useMemo(() => {
    if (!data?.items) return [];
    let list = [...data.items];

    if (selectedLanguage !== "all") {
      list = list.filter((r) => r.language === selectedLanguage);
    }

    if (sortBy === "stars") {
      list.sort((a, b) => b.stargazers_count - a.stargazers_count);
    } else if (sortBy === "forks") {
      list.sort((a, b) => b.forks_count - a.forks_count);
    } else if (sortBy === "updated") {
      list.sort(
        (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    }

    return list;
  }, [data, sortBy, selectedLanguage]);

  return (
    <div className="min-h-screen pb-20">
      {/* Background glowing lights */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute top-10 right-1/4 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl" />
      </div>

      <main className="mx-auto max-w-4xl px-4 pt-12 sm:pt-16">
        {/* Header / Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel text-xs font-semibold text-indigo-300 mb-6 border border-indigo-500/30">
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub Explorer Engine</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Discover <span className="gradient-text">Repositories</span> Across GitHub
          </h1>
          <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Search millions of repositories, inspect language distribution, view commit activity trends, and analyze top contributors.
          </p>
        </div>

        {/* Search Bar Container */}
        <div className="glass-panel p-4 sm:p-6 rounded-2xl shadow-2xl mb-8 border border-slate-700/50">
          <SearchBar
            value={inputQuery}
            onChange={setInputQuery}
            onSearch={handleSearchTrigger}
            isSearching={isLoading}
          />

          {/* Quick presets */}
          <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800/80">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-indigo-400" /> Popular:
            </span>
            {SUGGESTIONS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleSuggestionClick(preset)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                  submittedQuery === preset
                    ? "bg-indigo-600/30 border-indigo-500 text-indigo-200 font-medium"
                    : "bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:border-slate-600"
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Results Area */}
        <div className="space-y-6">
          {/* Header row with filters */}
          {submittedQuery && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel px-5 py-3.5 rounded-xl border border-slate-800">
              <div>
                <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <span>Results for</span>
                  <span className="text-indigo-400 font-mono">"{submittedQuery}"</span>
                  {data && (
                    <span className="text-xs font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                      {data.total_count.toLocaleString()} found
                    </span>
                  )}
                </h2>
              </div>

              {/* Sorting & Language Filter */}
              {data && data.items.length > 0 && (
                <div className="flex items-center gap-3 text-xs flex-wrap">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Filter:</span>
                  </div>

                  {availableLanguages.length > 0 && (
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="glass-input px-2.5 py-1.5 rounded-lg text-slate-200 text-xs focus:outline-none cursor-pointer"
                    >
                      <option value="all">All Languages</option>
                      {availableLanguages.map((lang) => (
                        <option key={lang} value={lang} className="bg-slate-900 text-slate-200">
                          {lang}
                        </option>
                      ))}
                    </select>
                  )}

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="glass-input px-2.5 py-1.5 rounded-lg text-slate-200 text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="best-match" className="bg-slate-900">Best Match</option>
                    <option value="stars" className="bg-slate-900">Most Stars ★</option>
                    <option value="forks" className="bg-slate-900">Most Forks</option>
                    <option value="updated" className="bg-slate-900">Recently Updated</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Empty State when no query submitted yet */}
          {!submittedQuery && (
            <div className="text-center py-16 px-4 glass-panel rounded-2xl border border-dashed border-slate-800">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                <GithubIcon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-semibold text-slate-200">Ready to explore</h3>
              <p className="mt-1 text-sm text-slate-400 max-w-md mx-auto">
                Enter a repository name or keyword above and press <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 text-indigo-300 rounded font-mono text-xs">Enter</kbd> to initiate the GitHub API search.
              </p>
            </div>
          )}

          {/* Loading Skeleton */}
          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="glass-panel p-5 rounded-2xl animate-pulse space-y-3 border border-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800" />
                    <div className="space-y-2 flex-1">
                      <div className="h-3 bg-slate-800 rounded w-1/4" />
                      <div className="h-4 bg-slate-800 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="h-3 bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-800 rounded w-1/3 pt-2" />
                </div>
              ))}
            </div>
          )}

          {/* Error display */}
          {isError && (
            <div className="glass-panel p-6 rounded-2xl border border-rose-500/30 text-center">
              <p className="text-sm font-medium text-rose-400">
                {error instanceof Error ? error.message : "Something went wrong fetching from GitHub API."}
              </p>
            </div>
          )}

          {/* Search Results List */}
          {data && processedRepositories.length === 0 && !isLoading && (
            <div className="text-center py-12 glass-panel rounded-2xl border border-slate-800">
              <p className="text-slate-400 text-sm">No repositories found matching your filter criteria.</p>
            </div>
          )}

          {data && processedRepositories.length > 0 && !isLoading && (
            <div className="grid grid-cols-1 gap-4">
              {processedRepositories.map((repo: Repository) => (
                <RepositoryCard key={repo.id} repo={repo} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
