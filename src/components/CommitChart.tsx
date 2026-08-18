import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import type { WeeklyCommits } from "../services/github";

export function CommitChart({ weeks }: { weeks: WeeklyCommits[] }) {
  const recentWeeks = weeks.slice(-12);

  const data = recentWeeks.map((week) => ({
    label: formatWeek(week.week),
    commits: week.total,
  }));

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800">
      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} stroke="#334155" />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }} stroke="#334155" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#334155",
                borderRadius: "12px",
                color: "#f8fafc",
                fontSize: "12px",
                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)",
              }}
              formatter={(value: any) => [`${value ?? 0} commits`, "Activity"]}
            />
            <Bar dataKey="commits" fill="url(#commitGradient)" radius={[6, 6, 0, 0]} />
            <defs>
              <linearGradient id="commitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#4f46e5" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function formatWeek(unixSeconds: number): string {
  const date = new Date(unixSeconds * 1000);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
