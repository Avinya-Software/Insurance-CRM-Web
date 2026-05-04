import { motion } from "framer-motion";
import { Phone, FileCheck, RefreshCw, MessageSquare, CalendarClock, ShieldCheck } from "lucide-react";

const timeline = [
  {
    icon: Phone,
    title: "Call completed",
    customer: "Elena Cruz",
    note: "Discussed renewal options for health policy.",
    time: "Today · 10:24 AM",
    status: "Completed",
    tone: "emerald",
  },
  {
    icon: RefreshCw,
    title: "Renewal reminder sent",
    customer: "Marcus Lee",
    note: "Auto policy renewal reminder dispatched via SMS + Email.",
    time: "Yesterday · 6:10 PM",
    status: "Sent",
    tone: "primary",
  },
  {
    icon: FileCheck,
    title: "Documents collected",
    customer: "Priya Shah",
    note: "KYC and claim form received and verified.",
    time: "2 days ago",
    status: "Verified",
    tone: "emerald",
  },
  {
    icon: ShieldCheck,
    title: "Claim status updated",
    customer: "David Owens",
    note: "Claim #4821 moved to under-review by insurer.",
    time: "3 days ago",
    status: "In review",
    tone: "amber",
  },
  {
    icon: CalendarClock,
    title: "Follow-up scheduled",
    customer: "Sara Khan",
    note: "Meeting set for policy upgrade discussion.",
    time: "Next Monday · 3:00 PM",
    status: "Scheduled",
    tone: "primary",
  },
];

const benefits = [
  "Never lose customer communication history",
  "Better customer relationship management",
  "Easy follow-up tracking across teams",
  "Organized insurance operations",
];

const toneClasses: Record<string, string> = {
  emerald: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  primary: "bg-primary/10 text-primary border-primary/30",
  amber: "bg-amber-500/15 text-amber-500 border-amber-500/30",
};

export function FollowUpHistory() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute right-0 top-1/3 h-[500px] w-[500px] rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-medium text-primary">
            📜 Follow-Up History
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold md:text-5xl">
            <span className="gradient-text">Follow-up history</span> management
          </h2>
          <p className="mt-4 text-muted-foreground">
            Track every call, renewal reminder, claim update and customer interaction in one
            organized timeline — so nothing slips through the cracks.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-5 top-2 bottom-2 w-px bg-gradient-to-b from-primary/40 via-border to-transparent" />
            <ul className="space-y-4">
              {timeline.map((item, i) => (
                <motion.li
                  key={item.title + i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="relative pl-14"
                >
                  <div className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card shadow-sm">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="rounded-xl border border-border/60 bg-card/40 p-4 backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-md">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold">{item.title}</h3>
                        <span className="text-xs text-muted-foreground">· {item.customer}</span>
                      </div>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${toneClasses[item.tone]}`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm text-muted-foreground">{item.note}</p>
                    <p className="mt-2 text-[11px] text-muted-foreground/80">{item.time}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Benefits panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="h-fit rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur-xl"
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Why it matters
              </span>
            </div>
            <h3 className="mt-3 font-display text-xl font-bold">
              One source of truth for every customer touchpoint
            </h3>
            <ul className="mt-5 space-y-3">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full gradient-primary" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 grid grid-cols-3 gap-2 rounded-xl border border-border/60 bg-background/40 p-3">
              <div className="text-center">
                <p className="font-display text-xl font-bold gradient-text">12k+</p>
                <p className="text-[10px] text-muted-foreground">Interactions logged</p>
              </div>
              <div className="text-center">
                <p className="font-display text-xl font-bold gradient-text">98%</p>
                <p className="text-[10px] text-muted-foreground">Follow-up rate</p>
              </div>
              <div className="text-center">
                <p className="font-display text-xl font-bold gradient-text">0</p>
                <p className="text-[10px] text-muted-foreground">Missed renewals</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
