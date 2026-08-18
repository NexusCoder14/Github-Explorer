import { Link } from "react-router-dom";
import { Star, GitFork, AlertCircle, ArrowUpRight } from "lucide-react";
import type { Repository } from "../services/github";

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Vue: "#41b883",
};

export function RepositoryCard({ repo }: { repo: Repository }) {
  const languageColor = repo.language
    ? LANGUAGE_COLORS[repo.language] || "#8b5cf6"
    : "#64748b";

  return (
    <Link
      to={`/repo/${repo.owner.login}/${repo.name}`}
      className="glass-card group block p-5 rounded-2xl relative overflow-hidden transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <img
            src={repo.owner.avatar_url}
            alt={repo.owner.login}
            className="w-10 h-10 rounded-full border border-indigo-500/30 object-cover shadow-sm group-hover:scale-105 transition-transform"
          />
          <div className="truncate">
            <span className="text-xs font-medium text-slate-400 block truncate">
              {repo.owner.login}
            </span>
            <h3 className="text-base font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors truncate">
              {repo.name}
            </h3>
          </div>
        </div>

        <div className="p-2 text-slate-400 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
          <ArrowUpRight className="w-5 h-5" />
        </div>
      </div>

      {repo.description && (
        <p className="mt-3 text-sm text-slate-300 line-clamp-2 leading-relaxed font-normal">
          {repo.description}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-3 border-t border-slate-800/80">
        {repo.language && (
          <div className="flex items-center gap-1.5 font-medium text-slate-300">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: languageColor }}
            />
            <span>{repo.language}</span>
          </div>
        )}

        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
          <span className="font-semibold text-slate-200">{formatCount(repo.stargazers_count)}</span>
        </div>

        <div className="flex items-center gap-1">
          <GitFork className="w-3.5 h-3.5 text-slate-400" />
          <span>{formatCount(repo.forks_count)}</span>
        </div>

        <div className="flex items-center gap-1 ml-auto">
          <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
          <span>{formatCount(repo.open_issues_count)} issues</span>
        </div>
      </div>
    </Link>
  );
}

function formatCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return String(count);
}
