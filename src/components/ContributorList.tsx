import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getContributors } from "../services/github";
import { Trophy, Users, GitCommit } from "lucide-react";

export function ContributorList({ owner, name }: { owner: string; name: string }) {
  const [page, setPage] = useState(1);
  const [allContributors, setAllContributors] = useState<
    Awaited<ReturnType<typeof getContributors>>
  >([]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["contributors", owner, name, page],
    queryFn: async () => {
      const contributors = await getContributors(owner, name, page);

      setAllContributors((previous) =>
        page === 1 ? contributors : [...previous, ...contributors]
      );

      return contributors;
    },
  });

  if (isLoading && page === 1) {
    return <p className="text-sm text-slate-400">Loading contributors...</p>;
  }

  if (isError) {
    return <p className="text-sm text-rose-400">Could not load contributor list.</p>;
  }

  if (allContributors.length === 0) {
    return <p className="text-sm text-slate-400">No contributor data available.</p>;
  }

  const canLoadMore = data !== undefined && data.length === 10;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {allContributors.map((contributor, index) => {
          const isTop3 = index < 3;
          return (
            <a
              key={contributor.id}
              href={`https://github.com/${contributor.login}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative">
                  <img
                    src={contributor.avatar_url}
                    alt={`${contributor.login} avatar`}
                    className="h-9 w-9 rounded-full border border-slate-700 object-cover"
                  />
                  {isTop3 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-[10px] font-bold text-slate-950 flex items-center justify-center shadow-md">
                      {index + 1}
                    </span>
                  )}
                </div>
                <div className="truncate">
                  <span className="text-sm font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors block truncate">
                    {contributor.login}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <GitCommit className="w-3 h-3 text-indigo-400" />
                    {contributor.contributions.toLocaleString()} commits
                  </span>
                </div>
              </div>

              {isTop3 && <Trophy className="w-4 h-4 text-amber-400 shrink-0" />}
            </a>
          );
        })}
      </div>

      {canLoadMore && (
        <div className="pt-2 text-center">
          <button
            onClick={() => setPage((current) => current + 1)}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all disabled:opacity-50"
          >
            <Users className="w-3.5 h-3.5" />
            <span>{isLoading ? "Loading..." : "Load More Contributors"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
