import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { LanguageBytes } from "../services/github";

const COLORS = ["#6366f1", "#a855f7", "#38bdf8", "#f59e0b", "#ec4899", "#10b981", "#8b5cf6", "#64748b"];

export function LanguageChart({ languages }: { languages: LanguageBytes }) {
  const entries = Object.entries(languages);
  const totalBytes = entries.reduce((sum, [, bytes]) => sum + bytes, 0);

  if (entries.length === 0 || totalBytes === 0) {
    return <p className="text-sm text-slate-400">No language breakdown data available.</p>;
  }

  const data = entries
    .map(([name, bytes]) => ({
      name,
      percent: Math.round((bytes / totalBytes) * 1000) / 10,
    }))
    .sort((a, b) => b.percent - a.percent);

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row glass-panel p-6 rounded-2xl border border-slate-800">
      <div className="h-52 w-52 shrink-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="percent"
              nameKey="name"
              innerRadius={50}
              outerRadius={85}
              paddingAngle={3}
              stroke="transparent"
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#334155",
                borderRadius: "12px",
                color: "#f8fafc",
                fontSize: "12px",
              }}
              formatter={(value: any) => [`${value ?? 0}%`, "Usage"]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="w-full space-y-2 text-xs">
        {data.map((entry, index) => (
          <li key={entry.name} className="flex items-center justify-between gap-3 p-2 rounded-lg bg-slate-900/50 border border-slate-800/60">
            <span className="flex items-center gap-2.5 text-slate-200 font-medium">
              <span
                className="h-3 w-3 rounded-full shadow-sm"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              {entry.name}
            </span>
            <span className="text-slate-400 font-mono">{entry.percent}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
