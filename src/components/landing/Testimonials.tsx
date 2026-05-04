import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

const reviews = [
  { name: "Sarah Mitchell", role: "Senior Agent", company: "Apex Insurance", review: "Insurance CRM cut our renewal management time by 70%. The voice AI alone is worth the price.", rating: 5, initials: "SM" },
  { name: "Daniel Kowalski", role: "Broker", company: "Northstar Brokers", review: "Finally a CRM built for insurance — not a generic tool. Claims tracking is incredibly fast.", rating: 5, initials: "DK" },
  { name: "Priya Sharma", role: "Operations Lead", company: "Shield Financial", review: "Our team adopted it in days. The renewal email automation literally pays for itself every month.", rating: 5, initials: "PS" },
  { name: "Marcus Chen", role: "Founder", company: "Beacon Advisors", review: "The dashboard is gorgeous and the AI assistant feels like having an extra team member.", rating: 5, initials: "MC" },
  { name: "Elena Rodriguez", role: "Agency Owner", company: "Coastal Insurance", review: "Best decision we made this year. Lead conversion is up 40% since switching.", rating: 5, initials: "ER" },
];

export function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % reviews.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold md:text-5xl">
            Loved by <span className="gradient-text">insurance pros</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Real stories from agents, brokers and agencies running on Insurance CRM.
          </p>
        </div>

        <div className="mt-14 overflow-hidden">
          <motion.div
            className="flex gap-6"
            animate={{ x: `-${index * (100 / reviews.length)}%` }}
            transition={{ type: "spring", stiffness: 60, damping: 20 }}
            style={{ width: `${reviews.length * 100}%` }}
          >
            {reviews.map((r) => (
              <div key={r.name} className="w-full px-2 md:w-1/3" style={{ flex: `0 0 ${100 / reviews.length}%` }}>
                <div className="h-full rounded-2xl border border-border glass p-6 shadow-card">
                  <div className="mb-3 flex">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed">"{r.review}"</p>
                  <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-primary text-sm font-bold text-white">
                      {r.initials}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{r.name}</div>
                      <div className="text-xs text-muted-foreground">{r.role} · {r.company}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${i === index ? "w-8 gradient-primary" : "w-2 bg-border"}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
