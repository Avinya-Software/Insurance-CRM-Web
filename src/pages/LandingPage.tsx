import { useState } from "react";
import { ThemeProvider, useTheme } from "../hooks/use-theme";
import { Navbar } from "../components/landing/Navbar";
import { Hero } from "../components/landing/Hero";
import { Features } from "../components/landing/Features";
import { WhyChoose } from "../components/landing/WhyChoose";
import { VoiceAI } from "../components/landing/VoiceAI";
import { FollowUpHistory } from "../components/landing/FollowUpHistory";
import { Testimonials } from "../components/landing/Testimonials";
import { Pricing } from "../components/landing/Pricing";
import { FAQ } from "../components/landing/FAQ";
import { Contact } from "../components/landing/Contact";
import { Footer } from "../components/landing/Footer";
import { BackToTop } from "../components/landing/BackToTop";
import { CursorGlow } from "../components/landing/CursorGlow";
import { AuthModal } from "../components/landing/AuthModal";
import { useNavigate } from "react-router-dom";
import "../landing.css";

export default function LandingPage() {
  return (
    <ThemeProvider>
      <LandingContent />
    </ThemeProvider>
  );
}

function LandingContent() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [authMode, setAuthMode] = useState<"login" | "register" | null>(null);

  return (
    <div className={`landing-page ${theme === "dark" ? "dark" : ""} relative min-h-screen overflow-x-hidden bg-background text-foreground transition-colors duration-500`}>
      <CursorGlow />
      <Navbar
        onLogin={() => setAuthMode("login")}
        onRegister={() => setAuthMode("register")}
      />
      <main>
        <Hero onTrial={() => setAuthMode("register")} />
        <Features />
        <WhyChoose />
        <VoiceAI />
        <FollowUpHistory />
        <Testimonials />
        <Pricing onSelect={() => setAuthMode("register")} />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <BackToTop />

      <AuthModal
        mode={authMode}
        onClose={() => setAuthMode(null)}
        onSwitch={(m) => setAuthMode(m)}
      />
    </div>
  );
}
