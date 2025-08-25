"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FadeIn from "@/components/fade-in";

// Metadata moved to separate server file metadata.ts to satisfy Next.js constraints for client components.

export default function SchedulePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [exitIntentOpen, setExitIntentOpen] = useState(false);
  const [exitIntentHasShown, setExitIntentHasShown] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setIsModalOpen(false);
    setFormData({ firstName: "", lastName: "", email: "" });
  };

  const openModal = () => setIsModalOpen(true);

  // Exit intent handler (desktop-focused: triggers when cursor leaves viewport top)
  const handleMouseOut = useCallback(
    (e: MouseEvent) => {
      if (exitIntentHasShown || exitIntentOpen) return;
      if (!e.relatedTarget && e.clientY <= 0) {
        setExitIntentOpen(true);
        setExitIntentHasShown(true);
      }
    },
    [exitIntentHasShown, exitIntentOpen]
  );

  useEffect(() => {
    window.addEventListener("mouseout", handleMouseOut);
    return () => window.removeEventListener("mouseout", handleMouseOut);
  }, [handleMouseOut]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Navigation (reused styling) */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-24">
            <div className="flex items-center space-x-2">
              <Image
                src="/FTTHorizontal-thin.webp"
                alt="Freedom Team Trading"
                width={400}
                height={151}
                className="h-10 w-auto"
                priority
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Embedded Scheduler */}
      <main className="flex-1 flex flex-col w-full">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
          <FadeIn
            as="h1"
            y={24}
            duration={0.6}
            amount={0.1}
            enterViewportOffset={0}
            className="font-serif font-black text-4xl md:text-5xl text-foreground leading-tight text-center">
            Schedule your call below!
          </FadeIn>
          <FadeIn
            as="p"
            delay={0.15}
            y={16}
            duration={0.5}
            amount={0.1}
            enterViewportOffset={0}
            className="mt-4 text-center text-sm md:text-base text-white">
            Page not loading?{' '}
            <a
              href="https://app.iclosed.io/e/freedomteamtrading/freedom-team-strategy-session"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline font-semibold underline"
            >
              Click Here
            </a>
          </FadeIn>
          
        </div>
        <div className="w-full">
          {/* We give the iframe a generous min-height so it pushes the footer down; adjust as needed */}
          <iframe
            src="https://app.iclosed.io/e/freedomteamtrading/freedom-team-strategy-session?sl=result&embedType=undefined&referrerUrl=https%3A%2F%2Ffreedomteamtrade.com%2F3-schedule-page1682423104339%3Fsl%3Dresult"
            title="Strategy Session"
            className="w-full min-h-[600px] border-0"
            frameBorder={0}
            sandbox="allow-scripts allow-downloads allow-same-origin allow-popups allow-forms allow-top-navigation allow-popups-to-escape-sandbox"
            allowFullScreen
          />
        </div>
      </main>

      {/* Footer (reused styling) */}
      <footer className="py-12 bg-card border-t border-border mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Image
                src="/FTTLogoBlack.png"
                alt="Freedom Team Trading"
                width={400}
                height={400}
                className="h-20 w-auto"
                loading="lazy"
              />
            </div>
            <div className="flex items-center space-x-6 text-md text-muted-foreground">
              <a
                href="/privacy-policy"
                className="hover:text-card-foreground transition-colors">
                Privacy Policy
              </a>
              <a
                href="/terms-conditions"
                className="hover:text-card-foreground transition-colors">
                Terms & Conditions
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-md text-muted-foreground">
              © {new Date().getFullYear()} Freedom Team Trading. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Modal (same as home for consistency) */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif font-bold text-center">
              Book Your Free Strategy Session
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
              Schedule My Free Session
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Exit Intent Popup */}
      {exitIntentOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-intent-title">
          <div className="relative w-[90%] sm:w-[85%] lg:w-[80%] max-w-[1100px] bg-card border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 animate-subtle-shake">
            <button
              aria-label="Close"
              onClick={() => setExitIntentOpen(false)}
              className="absolute top-3 right-3 h-8 w-8 inline-flex items-center justify-center rounded-md bg-background/60 hover:bg-background text-foreground transition">
              ×
            </button>
            <div className="p-8 space-y-6">
              <div className="space-y-2 text-center">
                <h2
                  id="exit-intent-title"
                  className="font-serif font-black text-3xl text-card-foreground">
                  Don't Miss Out!
                </h2>
                <p className="text-lg text-muted-foreground m-0">
                  Schedule your free strategy session today & receive a FREE
                  eBook:
                  <br />
                  <span className="font-semibold text-muted-foreground text-3xl">
                    THE OPTIONS SCANNER BLUEPRINT
                  </span>
                </p>
                <p className="text-md text-muted-foreground">
                  Rare, insider-level strategies to find winning 1,000% options
                  plays... before they take off
                </p>
              </div>
              <div className="space-y-4 text-md text-black bg-gray-300 p-5 rounded-xl font-semibold">
                <p className="font-black text-lg">
                  Here's what you'll get inside:
                </p>
                <ul className="list-disc pl-5 grid sm:grid-cols-2 gap-x-8 gap-y-2">
                  <li className="pr-4">
                    The exact scan settings we use every day to find bullish and
                    bearish setups in seconds
                  </li>
                  <li className="pr-4">
                    How to filter out 90% of “noise” stocks so you only see
                    plays with strong potential
                  </li>
                  <li className="pr-4">
                    When and why to flip the scan for bear setups that can
                    deliver just as much upside
                  </li>
                  <li className="pr-4">
                    A simple chart review process to confirm entries in under 30
                    minutes a day
                  </li>
                  <li className="pr-4">
                    How to pair your scans with options volume checks to avoid
                    costly mistakes
                  </li>
                  <li className="pr-4">
                    The method we’ve refined over years of trading that works
                    for accounts big or small
                  </li>
                </ul>
                <p className="text-black text-md">
                  This is not theory… it’s our real, day-to-day scan process,
                  broken down so you can start using it immediately. And right
                  now, when you book your free 1-on-1 strategy session, you’ll
                  get it instantly as a bonus.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setExitIntentOpen(false)}
                  className="flex-1 border-border p-3 font-black text-xl h-auto rounded-xl">
                  Continue Booking
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
