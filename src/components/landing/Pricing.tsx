import { motion } from "framer-motion";
import {
  Mic, RefreshCw, Brain, ShieldCheck, Users, BellRing, FolderLock, BarChart3,
} from "lucide-react";

const features = [
  { icon: Mic, title: "AI Voice Task Automation", desc: "Create tasks using voice commands instantly — no typing required." },
  { icon: RefreshCw, title: "Smart Renewal Tracking", desc: "Never miss policy renewals or reminders with automated alerts." },
  { icon: Brain, title: "AI Customer Insights", desc: "Understand customer activity and follow-up priority automatically." },
  { icon: ShieldCheck, title: "Claim Process Monitoring", desc: "Track claim progress with intelligent workflow updates." },
  { icon: Users, title: "Real-Time Team Collaboration", desc: "Teams stay synced with live task updates across devices." },
  { icon: BellRing, title: "Automated Follow-Up Reminders", desc: "AI automatically reminds agents about pending actions." },
  { icon: FolderLock, title: "Document & Policy Management", desc: "Organize customer files securely in one centralized place." },
  { icon: BarChart3, title: "AI Productivity Analytics", desc: "Show team efficiency and performance metrics in real time." },
];

interface PricingProps { onSelect: () => void }

export function Pricing({ onSelect: _onSelect }: PricingProps) {
  return (
    <section id="pricing" className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute left-1/4 top-1/3 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 bottom-1/3 h-[500px] w-[500px] rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-medium text-primary">
            ⚡ AI-Powered CRM
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold md:text-5xl">
            Why modern insurance teams choose <span className="gradient-text">AI CRM</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Automate follow-ups, improve customer relationships, and manage insurance operations
            smarter with AI-driven workflows.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -6 }}
              className="group relative rounded-2xl p-[1px] transition-all"
            >
              {/* Gradient border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/40 via-accent/30 to-transparent opacity-50 transition-opacity group-hover:opacity-100" />

              <div className="relative h-full rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-xl transition-all group-hover:shadow-[0_0_40px_-10px_var(--color-primary)]">
                {/* Glow on hover */}
                <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-primary/0 via-primary/0 to-accent/0 opacity-0 transition-opacity duration-500 group-hover:from-primary/10 group-hover:via-transparent group-hover:to-accent/10 group-hover:opacity-100" />

                <motion.div
                  whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="relative flex h-12 w-12 items-center justify-center rounded-xl gradient-primary text-white shadow-glow"
                >
                  <f.icon className="h-5 w-5" />
                </motion.div>

                <h3 className="relative mt-5 font-display text-base font-bold">{f.title}</h3>
                <p className="relative mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
