import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { Check, X } from "lucide-react";

function Counter({ to, suffix = "%" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => `${Math.round(v)}${suffix}`);

  useEffect(() => {
    if (inView) {
      const ctrl = animate(mv, to, { duration: 1.6, ease: "easeOut" });
      return () => ctrl.stop();
    }
  }, [inView, to, mv]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

const stats = [
  { value: 95, label: "Faster Operations" },
  { value: 80, label: "Better Customer Tracking" },
  { value: 60, label: "More Renewals" },
];

const compare = [
  { manual: "Hours of manual data entry", auto: "Automated lead capture & enrichment" },
  { manual: "Missed renewals & follow-ups", auto: "Smart renewal reminders by email" },
  { manual: "Slow claim processing", auto: "Streamlined claim intake & tracking" },
  { manual: "Scattered customer data", auto: "Unified 360° customer profiles" },
  { manual: "No voice or AI tools", auto: "Voice AI assistant always on" },
];

export function WhyChoose() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 gradient-hero opacity-60" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold md:text-5xl">
            Why teams choose <span className="gradient-text">Insurance CRM</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Move from manual chaos to automated growth in days, not months.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-border glass p-8 text-center shadow-card"
            >
              <div className="font-display text-5xl font-bold gradient-text md:text-6xl">
                <Counter to={s.value} />
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-border bg-card p-8 shadow-card"
          >
            <h3 className="mb-1 font-display text-xl font-bold text-muted-foreground">Manual Work</h3>
            <p className="mb-6 text-sm text-muted-foreground">The old way of running insurance</p>
            <ul className="space-y-3">
              {compare.map((c) => (
                <li key={c.manual} className="flex items-start gap-3 text-sm">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  <span className="text-muted-foreground">{c.manual}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl border border-primary/30 bg-card p-8 shadow-card"
          >
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full gradient-primary opacity-20 blur-3xl" />
            <h3 className="mb-1 font-display text-xl font-bold gradient-text">Insurance CRM</h3>
            <p className="mb-6 text-sm text-muted-foreground">The automated, AI-powered way</p>
            <ul className="space-y-3">
              {compare.map((c) => (
                <li key={c.auto} className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span>{c.auto}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
