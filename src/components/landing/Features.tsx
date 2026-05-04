import { motion } from "framer-motion";
import {
  UserPlus, Users, FileText, ShieldCheck, Bell, Mail,
  Mic, ListTodo, FolderUp, BarChart3,
} from "lucide-react";

const features = [
  { icon: UserPlus, title: "Lead Management", desc: "Capture, score and convert leads with smart pipelines." },
  { icon: Users, title: "Customer Management", desc: "360° customer profiles with interaction history." },
  { icon: FileText, title: "Policy Management", desc: "General + life insurance policies in one place." },
  { icon: ShieldCheck, title: "Claims Management", desc: "Faster claim intake, tracking and resolution." },
  { icon: Bell, title: "Renewal Reminders", desc: "Automated alerts so you never miss a renewal." },
  { icon: Mail, title: "Email Automation", desc: "Trigger renewal emails, drip campaigns and follow-ups." },
  { icon: Mic, title: "Voice AI Assistant", desc: "Search, update and remind — all by voice." },
  { icon: ListTodo, title: "Task Management", desc: "Daily and weekly tasks with smart scheduling." },
  { icon: FolderUp, title: "Document Storage", desc: "Secure document upload and customer linking." },
  { icon: BarChart3, title: "Performance Tracking", desc: "Weekly reports for agents, teams and brokers." },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="rounded-full border border-border glass px-4 py-1 text-xs font-medium">
            Everything in one platform
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold md:text-5xl">
            Powerful features built for{" "}
            <span className="gradient-text">insurance teams</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Replace spreadsheets, email threads and scattered tools with one premium CRM
            tailored for insurance workflows.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: (i % 5) * 0.06 }}
              whileHover={{ y: -6 }}
              className="group relative rounded-2xl border border-border glass p-6 shadow-card gradient-border transition-all hover:shadow-soft"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl gradient-primary text-white shadow-soft transition-transform group-hover:scale-110">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
