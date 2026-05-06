import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Mic, Calendar, Clock, CheckCircle2, Sparkles } from "lucide-react";

const features = [
  { icon: Mic, label: "Voice-based task entry" },
  { icon: Calendar, label: "Smart date & time detection" },
  { icon: Clock, label: "Auto-scheduled reminders" },
  { icon: CheckCircle2, label: "Instant task creation" },
];

const voiceExamples = [
  { phrase: "Call customer tomorrow at 11 AM", task: "Call customer", when: "Tomorrow · 11:00 AM" },
  { phrase: "Renew policy follow-up next week", task: "Policy renewal follow-up", when: "Next Monday" },
  { phrase: "Meeting with client at 4 PM", task: "Client meeting", when: "Today · 4:00 PM" },
  { phrase: "Send claim documents Monday", task: "Send claim documents", when: "Monday · 9:00 AM" },
];

export function VoiceAI() {
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [showTask, setShowTask] = useState(false);

  useEffect(() => {
    const current = voiceExamples[index].phrase;
    setTyped("");
    setShowTask(false);

    let i = 0;
    const typer = setInterval(() => {
      i++;
      setTyped(current.slice(0, i));
      if (i >= current.length) {
        clearInterval(typer);
        setTimeout(() => setShowTask(true), 350);
      }
    }, 45);

    const next = setTimeout(() => {
      setIndex((p) => (p + 1) % voiceExamples.length);
    }, 4800);

    return () => {
      clearInterval(typer);
      clearTimeout(next);
    };
  }, [index]);

  const example = voiceExamples[index];

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 md:grid-cols-2 md:px-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <span className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-medium text-primary">
            ✨ Voice AI
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold md:text-5xl">
            Create tasks faster with <span className="gradient-text">Voice AI</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Speak naturally and Insurance CRM automatically creates and schedules your tasks —
            no typing, no clicks. Just say it and it's done.
          </p>

          <ul className="mt-8 space-y-3">
            {features.map((f, i) => (
              <motion.li
                key={f.label}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <f.icon className="h-4 w-4" />
                </div>
                <span className="text-sm">{f.label}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Voice Task action area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative mx-auto w-full max-w-[480px]"
        >
          <div className="relative rounded-2xl border border-border/60 bg-card/40 p-8 backdrop-blur-xl shadow-xl">
            {/* Live badge */}
            <div className="mb-6 flex items-center justify-between">
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-medium text-emerald-500">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                Listening
              </span>
              <span className="text-xs text-muted-foreground">Voice AI · Smart Tasks</span>
            </div>

            {/* Mic with pulse rings */}
            <div className="relative mx-auto flex h-44 w-44 items-center justify-center">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0.7, opacity: 0.6 }}
                  animate={{ scale: 1.8, opacity: 0 }}
                  transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.8, ease: "easeOut" }}
                  className="absolute h-32 w-32 rounded-full border-2 border-primary"
                />
              ))}
              <motion.div
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="relative flex h-24 w-24 items-center justify-center rounded-full gradient-primary shadow-glow"
              >
                <Mic className="h-9 w-9 text-white" />
              </motion.div>
            </div>

            {/* Waveform */}
            <div className="mt-2 flex h-10 items-end justify-center gap-1">
              {[14, 22, 32, 18, 38, 24, 30, 16, 28, 36, 20, 26, 14, 22].map((h, i) => (
                <motion.span
                  key={i}
                  animate={{ height: [`${h * 0.3}px`, `${h}px`, `${h * 0.4}px`] }}
                  transition={{ duration: 0.7 + (i % 4) * 0.1, repeat: Infinity, delay: i * 0.05 }}
                  className="w-1 rounded-full gradient-primary"
                  style={{ height: 4 }}
                />
              ))}
            </div>

            {/* Speech-to-text preview */}
            <div className="mt-6 rounded-xl border border-border/60 bg-background/50 p-4">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
                <Sparkles className="h-3 w-3 text-primary" />
                You said
              </div>
              <p className="mt-1.5 min-h-[1.5rem] text-sm font-medium">
                "{typed}
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="ml-0.5 inline-block"
                >
                  |
                </motion.span>
                "
              </p>
            </div>

            {/* Created task card */}
            <AnimatePresence mode="wait">
              {showTask && (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.35 }}
                  className="mt-3 flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg gradient-primary text-white">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold">{example.task}</p>
                      <span className="rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-medium text-emerald-500">
                        Added to Pending
                      </span>
                    </div>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {example.when}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Floating example chips */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {voiceExamples.map((ex, i) => (
              <span
                key={ex.phrase}
                className={`rounded-full border px-3 py-1 text-[11px] transition-all ${
                  i === index
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border/60 text-muted-foreground"
                }`}
              >
                "{ex.phrase}"
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
