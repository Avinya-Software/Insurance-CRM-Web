import { motion } from "framer-motion";
import {
  ArrowRight, PlayCircle, Shield, TrendingUp, Users, FileCheck, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardMockup } from "./DashboardMockup";

interface HeroProps {
  onTrial: () => void;
}

export function Hero({ onTrial }: HeroProps) {
  return (
    <section id="home" className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      {/* Animated background blobs */}
      <div className="pointer-events-none absolute inset-0 gradient-hero" />
      <div className="pointer-events-none absolute left-[10%] top-20 h-72 w-72 rounded-full bg-primary/30 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute right-[5%] top-40 h-96 w-96 rounded-full bg-accent/25 blur-3xl animate-blob" style={{ animationDelay: "3s" }} />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-border glass px-4 py-1.5 text-xs font-medium"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Trusted by 2,500+ insurance professionals
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mx-auto max-w-4xl text-center font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl"
        >
          Smart Insurance CRM for{" "}
          <span className="gradient-text animate-gradient">Modern Insurance</span> Businesses
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mx-auto mt-6 max-w-2xl text-center text-base text-muted-foreground md:text-lg"
        >
          Automate your entire insurance workflow — from leads and policies to claims, renewals, and voice-powered task creation. One platform for agents, brokers, and insurers.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button
            size="lg"
            onClick={onTrial}
            className="group gradient-primary text-white shadow-soft hover:opacity-95"
          >
            Start Free Trial
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button size="lg" variant="outline" className="glass">
            <PlayCircle className="mr-1 h-4 w-4" />
            Book Demo
          </Button>
        </motion.div>

        {/* Dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="relative mx-auto mt-16 max-w-5xl"
        >
          <div className="absolute -inset-4 gradient-primary opacity-30 blur-3xl" />
          <div className="relative rounded-2xl border border-border glass shadow-card overflow-hidden">
            <DashboardMockup />
          </div>

          {/* Floating cards */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-4 top-1/4 hidden md:flex items-center gap-3 rounded-xl border border-border glass p-3 shadow-card"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary text-white">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">New Leads</div>
              <div className="text-lg font-bold">+248</div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -right-4 top-1/3 hidden md:flex items-center gap-3 rounded-xl border border-border glass p-3 shadow-card"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan/20 text-cyan">
              <FileCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Claims Closed</div>
              <div className="text-lg font-bold">98%</div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -bottom-6 left-1/4 hidden md:flex items-center gap-3 rounded-xl border border-border glass p-3 shadow-card"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 text-accent">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Renewals</div>
              <div className="text-lg font-bold">+60%</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-20 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-70"
        >
          {["AXA", "Allianz", "MetLife", "Prudential", "AIG", "Zurich"].map((b) => (
            <div key={b} className="flex items-center gap-2 text-sm font-semibold tracking-wider text-muted-foreground">
              <Shield className="h-4 w-4" /> {b}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
