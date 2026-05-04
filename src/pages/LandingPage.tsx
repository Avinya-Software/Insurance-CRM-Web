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

  return (
    <div className={`landing-page ${theme === "dark" ? "dark" : ""} relative min-h-screen overflow-x-hidden bg-background text-foreground transition-colors duration-500`}>
      <CursorGlow />
      <Navbar
        onLogin={() => navigate("/login")}
        onRegister={() => navigate("/register")}
      />
      <main>
        <Hero onTrial={() => navigate("/register")} />
        <Features />
        <WhyChoose />
        <VoiceAI />
        <FollowUpHistory />
        <Testimonials />
        <Pricing onSelect={() => navigate("/register")} />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
