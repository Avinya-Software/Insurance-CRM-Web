import { Shield, Twitter, Linkedin, Github, Facebook, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export function Footer() {
  const [email, setEmail] = useState("");

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Subscribed! Check your inbox.");
    setEmail("");
  };

  const cols = [
    { title: "Product", links: ["Features", "Voice AI", "Integrations", "Changelog"] },
    { title: "Company", links: ["About", "Customers", "Careers", "Blog", "Contact"] },
    { title: "Resources", links: ["Help Center", "API Docs", "Security", "Status", "Community"] },
    { title: "Legal", links: ["Privacy Policy", "Terms & Conditions", "Cookies", "GDPR", "DPA"] },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-border bg-card/50 backdrop-blur">
      {/* Animated gradient background */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent,var(--color-primary)/5%,transparent)] bg-[length:200%_200%] animate-gradient opacity-50" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
          <div className="col-span-2">
            <a href="#home" className="group flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary transition-all duration-300 group-hover:shadow-glow group-hover:scale-110">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="font-display text-lg font-bold transition-colors group-hover:text-primary">
                Insurance <span className="gradient-text">CRM</span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              The smart insurance CRM that automates leads, policies, claims and renewals — with voice AI built in.
            </p>

            <form onSubmit={subscribe} className="mt-6 flex max-w-sm gap-2">
              <Input
                type="email"
                placeholder="Subscribe to our newsletter"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="transition-all focus:shadow-glow"
              />
              <Button type="submit" className="gradient-primary text-white transition-all hover:shadow-glow hover:scale-105">
                Subscribe
              </Button>
            </form>

            <div className="mt-6 flex gap-3">
              {[Twitter, Linkedin, Facebook, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="social"
                  className="group/icon relative flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary/50 text-muted-foreground transition-all duration-300 hover:scale-110 hover:border-primary/50 hover:text-white hover:shadow-glow"
                >
                  <span className="absolute inset-0 rounded-lg gradient-primary opacity-0 transition-opacity duration-300 group-hover/icon:opacity-100" />
                  <Icon className="relative h-4 w-4 transition-transform duration-300 group-hover/icon:scale-110" />
                </a>
              ))}
            </div>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <div className="text-sm font-semibold">{c.title}</div>
              <ul className="mt-4 space-y-2">
                {c.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="group/link relative inline-flex items-center gap-1 text-sm text-muted-foreground transition-all duration-300 hover:text-primary"
                    >
                      <ArrowRight className="h-3 w-3 -translate-x-2 opacity-0 transition-all duration-300 group-hover/link:translate-x-0 group-hover/link:opacity-100" />
                      <span className="relative transition-transform duration-300 group-hover/link:translate-x-0">
                        {l}
                        <span className="absolute -bottom-0.5 left-0 h-px w-0 gradient-primary transition-all duration-300 group-hover/link:w-full" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 md:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Insurance CRM. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">Built with ❤️ for insurance teams worldwide.</p>
        </div>
      </div>
    </footer>
  );
}
