import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCommitActivity, getLanguages, getRepository } from "../services/github";
import { LanguageChart } from "../components/LanguageChart";
import { CommitChart } from "../components/CommitChart";
import { ContributorList } from "../components/ContributorList";
import {
  ArrowLeft,
  Star,
  GitFork,
  AlertCircle,
  ExternalLink,
  Code2,
  GitCommit,
  Users,
  ShieldCheck,
  Calendar,
  Clock,
} from "lucide-react";

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

export function RepositoryPage() {
  const { owner, name } = useParams<{ owner: string; name: string }>();

  const repoQuery = useQuery({
    queryKey: ["repository", owner, name],
    queryFn: () => getRepository(owner!, name!),
    enabled: Boolean(owner && name),
  });

  const languagesQuery = useQuery({
    queryKey: ["languages", owner, name],
    queryFn: () => getLanguages(owner!, name!),
    enabled: Boolean(owner && name),
  });

  const commitsQuery = useQuery({
    queryKey: ["commits", owner, name],
    queryFn: () => getCommitActivity(owner!, name!),
    enabled: Boolean(owner && name),
  });

  if (repoQuery.isLoading) {
    return (
      <div className="min-h-screen max-w-4xl mx-auto px-4 py-16">
        <div className="glass-panel p-8 rounded-2xl animate-pulse space-y-6">
          <div className="h-6 bg-slate-800 rounded w-1/4" />
          <div className="h-10 bg-slate-800 rounded w-1/2" />
          <div className="h-4 bg-slate-800 rounded w-3/4" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-slate-800 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (repoQuery.isError) {
    return (
      <div className="min-h-screen max-w-4xl mx-auto px-4 py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Search</span>
        </Link>
        <div className="glass-panel p-8 rounded-2xl border border-rose-500/30 text-center">
          <h2 className="text-xl font-bold text-rose-400">Unable to load repository</h2>
          <p className="mt-2 text-sm text-slate-400">
            {repoQuery.error instanceof Error
              ? repoQuery.error.message
              : "Something went wrong."}
          </p>
        </div>
      </div>
    );
  }

  const repo = repoQuery.data!;

  return (
    <div className="min-h-screen pb-24 pt-8">
      {/* Glow background */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-24 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl px-4">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-indigo-300 glass-panel px-3.5 py-2 rounded-xl transition-all mb-8 border border-slate-800"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-400" />
          <span>Back to Search</span>
        </Link>

        {/* Hero Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700/60 shadow-2xl relative overflow-hidden mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <img
                src={repo.owner.avatar_url}
                alt={repo.owner.login}
                className="w-16 h-16 rounded-2xl border-2 border-indigo-500/40 object-cover shadow-lg shrink-0"
              />
              <div>
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                  {repo.owner.login}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-0.5">
                  {repo.name}
                </h1>
                {repo.description && (
                  <p className="mt-2 text-sm text-slate-300 leading-relaxed max-w-2xl">
                    {repo.description}
                  </p>
                )}
              </div>
            </div>

            <a
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all shrink-0 active:scale-95"
            >
              <GithubIcon className="w-4 h-4" />
              <span>View on GitHub</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>

          {/* Quick Metrics Grid */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800">
            <MetricCard
              icon={<Star className="w-4 h-4 text-amber-400" />}
              label="Stars"
              value={repo.stargazers_count.toLocaleString()}
            />
            <MetricCard
              icon={<GitFork className="w-4 h-4 text-indigo-400" />}
              label="Forks"
              value={repo.forks_count.toLocaleString()}
            />
            <MetricCard
              icon={<AlertCircle className="w-4 h-4 text-sky-400" />}
              label="Open Issues"
              value={repo.open_issues_count.toLocaleString()}
            />
            <MetricCard
              icon={<ShieldCheck className="w-4 h-4 text-emerald-400" />}
              label="License"
              value={repo.license?.name ?? "No License"}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-400 pt-3">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" /> Created {formatDate(repo.created_at)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" /> Updated {formatDate(repo.updated_at)}
            </span>
          </div>
        </div>

        {/* Breakdown Sections */}
        <div className="space-y-8">
          {/* Languages */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Code2 className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-slate-200">Language Breakdown</h2>
            </div>
            {languagesQuery.isLoading && (
              <div className="glass-panel p-6 rounded-2xl text-sm text-slate-400">Loading language distribution...</div>
            )}
            {languagesQuery.isError && (
              <div className="glass-panel p-6 rounded-2xl text-sm text-rose-400">Could not load languages.</div>
            )}
            {languagesQuery.data && <LanguageChart languages={languagesQuery.data} />}
          </section>

          {/* Commit Activity */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <GitCommit className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-slate-200">Commit Activity (Recent Weeks)</h2>
            </div>
            {commitsQuery.isLoading && (
              <div className="glass-panel p-6 rounded-2xl text-sm text-slate-400">Loading commit timeline...</div>
            )}
            {commitsQuery.isError && (
              <div className="glass-panel p-6 rounded-2xl text-sm text-rose-400">Could not load commit history.</div>
            )}
            {commitsQuery.data === null && (
              <div className="glass-panel p-6 rounded-2xl text-sm text-amber-300/80">
                Commit statistics are currently generating on GitHub's side. Please check back in a few seconds.
              </div>
            )}
            {commitsQuery.data && commitsQuery.data.length > 0 && (
              <CommitChart weeks={commitsQuery.data} />
            )}
          </section>

          {/* Contributors */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-slate-200">Top Contributors</h2>
            </div>
            <ContributorList owner={owner!} name={name!} />
          </section>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
      <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <span className="text-lg font-bold text-slate-100 tracking-tight truncate">{value}</span>
    </div>
  );
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
