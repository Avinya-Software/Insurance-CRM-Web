import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";

const faqs = [
  { q: "How does AI voice task creation work?", a: "Just speak naturally — say something like \"Call customer tomorrow at 11 AM\" and Insurance CRM instantly converts it into a scheduled task in your pending queue using smart date and time detection." },
  { q: "Can Insurance CRM automate customer follow-ups?", a: "Yes. The system automatically schedules and sends follow-up reminders based on policy renewal dates, claim status, and customer interaction history — so no opportunity slips through the cracks." },
  { q: "Is customer policy data secure?", a: "Absolutely. We use end-to-end encryption, role-based access control, and audit logs. Enterprise plans include SSO, SCIM, and SOC 2 compliance for maximum data protection." },
  { q: "Can teams manage tasks together in real time?", a: "Yes. All task updates, comments, and status changes sync live across your team — no refreshes needed. Perfect for distributed agencies and broker teams." },
  { q: "Does the CRM support claim management?", a: "Fully. Track claims from intake to settlement with intelligent workflow stages, document attachments, communication history, and automated status updates for customers." },
  { q: "Can AI reminders reduce missed renewals?", a: "Yes — clients using our smart renewal tracking report up to 98% renewal rates. AI prioritizes which renewals need attention and automates outreach across email, SMS and in-app." },
  { q: "Is the platform mobile responsive?", a: "Insurance CRM works beautifully on any device — desktop, tablet, and mobile. Agents can update tasks, log calls, and use voice AI on the go." },
  { q: "Can admins track employee productivity?", a: "Yes. The AI productivity analytics dashboard surfaces team efficiency, tasks completed, follow-up rates, and individual performance metrics in real time." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-3xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-medium text-primary">
            💬 Got questions?
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold md:text-5xl">
            Frequently asked <span className="gradient-text">questions</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Everything you need to know about Insurance CRM.
          </p>
        </motion.div>

        <div className="mt-12 space-y-4">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group relative rounded-2xl p-[1px] transition-all"
              >
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br transition-opacity duration-500 ${
                    isOpen
                      ? "from-primary/50 via-accent/40 to-primary/30 opacity-100"
                      : "from-primary/30 via-accent/20 to-transparent opacity-0 group-hover:opacity-100"
                  }`}
                />
                <div className="relative rounded-2xl border border-border/60 bg-card/70 backdrop-blur-xl shadow-sm">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-display text-base font-semibold md:text-lg">{f.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full gradient-primary text-white shadow-glow"
                    >
                      <Plus className="h-4 w-4" />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">
                          {f.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
