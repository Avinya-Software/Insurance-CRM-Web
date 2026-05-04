import { motion } from "framer-motion";
import { TrendingUp, Users, FileText, Bell, Mic, CheckCircle2 } from "lucide-react";

export function DashboardMockup() {
  const bars = [40, 65, 50, 80, 60, 90, 75];

  return (
    <div className="bg-card p-4 md:p-6">
      {/* Top bar */}
      <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        </div>
        <div className="text-xs text-muted-foreground">app.insureflow.com/dashboard</div>
        <div className="w-12" />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {/* Stat cards */}
        {[
          { icon: Users, label: "Total Leads", value: "12,480", trend: "+12.5%", color: "text-primary", bg: "bg-primary/10" },
          { icon: FileText, label: "Active Policies", value: "8,231", trend: "+8.2%", color: "text-cyan", bg: "bg-cyan/10" },
          { icon: CheckCircle2, label: "Claims Resolved", value: "1,924", trend: "+24%", color: "text-accent", bg: "bg-accent/10" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            viewport={{ once: true }}
            className="rounded-xl border border-border bg-background/50 p-4"
          >
            <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg ${s.bg} ${s.color}`}>
              <s.icon className="h-4 w-4" />
            </div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className="text-xl font-bold">{s.value}</div>
            <div className="text-xs text-emerald-500">{s.trend}</div>
          </motion.div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
        {/* Chart */}
        <div className="rounded-xl border border-border bg-background/50 p-4 md:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Policy Growth</div>
              <div className="text-xs text-muted-foreground">Last 7 days</div>
            </div>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="flex h-32 items-end justify-between gap-2">
            {bars.map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                whileInView={{ height: `${h}%` }}
                transition={{ duration: 0.8, delay: i * 0.08, ease: "easeOut" }}
                viewport={{ once: true }}
                className="flex-1 rounded-t-md gradient-primary opacity-80"
              />
            ))}
          </div>
        </div>

        {/* Renewals */}
        <div className="rounded-xl border border-border bg-background/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold">Renewals</div>
            <Bell className="h-4 w-4 text-primary" />
          </div>
          <div className="space-y-2">
            {["Auto • J. Smith", "Life • A. Khan", "Health • R. Lee"].map((r, i) => (
              <motion.div
                key={r}
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center justify-between rounded-md bg-secondary/60 p-2 text-xs"
              >
                <span>{r}</span>
                <span className="rounded bg-primary/20 px-2 py-0.5 text-primary">{3 + i}d</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Voice AI bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        viewport={{ once: true }}
        className="mt-3 flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-3"
      >
        <div className="relative flex h-10 w-10 items-center justify-center rounded-lg gradient-primary text-white">
          <Mic className="h-5 w-5" />
          <span className="absolute inset-0 animate-ping rounded-lg bg-primary/40" />
        </div>
        <div className="flex-1">
          <div className="text-xs font-semibold">Voice AI Assistant</div>
          <div className="text-[11px] text-muted-foreground">"Show me policies expiring this week..."</div>
        </div>
        <div className="flex gap-0.5">
          {[8, 14, 20, 14, 8, 12].map((h, i) => (
            <motion.span
              key={i}
              animate={{ height: [`${h}px`, `${h + 8}px`, `${h}px`] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
              className="w-1 rounded-full gradient-primary"
              style={{ height: h }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
