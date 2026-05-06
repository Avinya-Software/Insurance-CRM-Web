import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

export function Contact() {
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Message sent! We'll be in touch soon.");
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold md:text-5xl">
            Get in <span className="gradient-text">touch</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Questions, demos, or partnerships — we usually reply within 1 business day.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 space-y-4"
          >
            {[
              { icon: Mail, label: "Email", value: "hello@insureflow.com" },
              { icon: Phone, label: "Phone", value: "+1 (555) 010-7281" },
              { icon: MapPin, label: "Office", value: "447 Market St, San Francisco, CA" },
            ].map((c) => (
              <div key={c.label} className="flex items-start gap-4 rounded-xl border border-border glass p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary text-white">
                  <c.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">{c.label}</div>
                  <div className="text-sm font-medium">{c.value}</div>
                </div>
              </div>
            ))}
            <div className="aspect-video w-full overflow-hidden rounded-xl border border-border bg-secondary/50">
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 via-accent/10 to-transparent">
                <MapPin className="h-10 w-10 text-primary" />
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onSubmit={submit}
            className="md:col-span-3 space-y-4 rounded-2xl border border-border glass p-6 shadow-card md:p-8"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Input required placeholder="Your name" />
              <Input required type="email" placeholder="you@company.com" />
            </div>
            <Input placeholder="Company" />
            <Textarea required placeholder="How can we help?" rows={5} />
            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="w-full gradient-primary text-white hover:opacity-90"
            >
              {loading ? "Sending..." : (<>Send message <Send className="ml-1 h-4 w-4" /></>)}
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
