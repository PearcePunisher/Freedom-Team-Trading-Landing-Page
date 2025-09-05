"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Users,
  TrendingUp,
  DollarSign,
  Clock,
  Target,
  BarChart3,
} from "lucide-react";
import { FadeIn } from "@/components/fade-in";
import { LazyVimeo } from "@/components/lazy-vimeo";

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const REDIRECT_URL = "/schedule";
  const REDIRECT_DELAY_MS = 1000; // 3s delay so user sees confirmation
  const redirectTimeoutRef = React.useRef<number | null>(null);
  const successAtRef = React.useRef<number | null>(null);
  const redirectedRef = React.useRef(false);
  // Keep the raw search string so we can preserve query params across redirects
  const urlSearchRef = React.useRef<string>("");
  // Parsed URL params to include in the lead payload
  const [urlParams, setUrlParams] = useState<Record<string, string> | null>(null);
  const router = useRouter();



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    console.log('[leads][submit] Starting submission');
    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
  // Include any captured URL params so analytics can ingest them server-side
  body: JSON.stringify({ ...formData, urlParams: urlParams || {} }),
      });
      console.log('[leads][submit] Response status', res.status);
      if (!res.ok) {
        console.error("Failed to submit");
        setSubmitting(false);
        return;
      }
      const data = await res.json();
      console.log('[leads][submit] Response JSON', data);
      if (!data?.success) {
        console.error("API did not return success");
        setSubmitting(false);
        return;
      }
      console.log('[leads][submit] Success true, scheduling redirect target', REDIRECT_URL);
      setSuccess(true);
      successAtRef.current = Date.now();
      // Clear form for UX
      setFormData({ firstName: "", lastName: "", email: "" });
      scheduleRedirect();
    } catch (err) {
      console.error("Submission error", err);
      setSubmitting(false);
    }
  };

  function performRedirect() {
    if (redirectedRef.current) return;
    redirectedRef.current = true;
    console.log('[leads][redirect] Navigating to', REDIRECT_URL);
    try {
      // Preserve original URL query string if available
      const dest = buildRedirectUrl();
      router.push(dest);
    } catch (e) {
      console.warn('[leads][redirect] router.push failed, falling back to window.location', e);
      window.location.href = buildRedirectUrl();
    }
  }

  function buildRedirectUrl() {
    const search = urlSearchRef.current || (typeof window !== 'undefined' ? window.location.search : '');
    return search && search.length > 0 ? `${REDIRECT_URL}${search}` : REDIRECT_URL;
  }

  function scheduleRedirect() {
    if (!successAtRef.current || redirectedRef.current) return;
    const elapsed = Date.now() - successAtRef.current;
    const remaining = REDIRECT_DELAY_MS - elapsed;
    if (remaining <= 0) {
      console.log('[leads][scheduleRedirect] Remaining <= 0, redirecting now');
      performRedirect();
      return;
    }
    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current);
    }
    console.log('[leads][scheduleRedirect] Scheduling redirect in', remaining, 'ms (elapsed', elapsed, 'ms)');
    redirectTimeoutRef.current = window.setTimeout(() => {
      console.log('[leads][redirectTimer] Timer fired after', remaining, 'ms');
      performRedirect();
    }, remaining);
  }

  const openModal = () => {
    // Reset any previous success state when reopening
    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current);
      redirectTimeoutRef.current = null;
    }
    setSuccess(false);
    setSubmitting(false);
    // Capture current URL params once when the modal opens so we can submit and preserve them
    try {
      if (typeof window !== 'undefined') {
        const search = window.location.search || '';
        urlSearchRef.current = search;
        if (search && search.length > 1) {
          const sp = new URLSearchParams(search);
          const parsed: Record<string, string> = {};
          sp.forEach((value, key) => {
            parsed[key] = value;
          });
          setUrlParams(parsed);
        } else {
          setUrlParams(null);
        }
      }
    } catch (err) {
      // Non-fatal: proceed without params
      console.warn('[leads][openModal] Failed to capture URL params', err);
      urlSearchRef.current = '';
      setUrlParams(null);
    }

    setIsModalOpen(true);
  };

  // If user manually closes dialog after success, still proceed with redirect if not already
  React.useEffect(() => {
    console.log('[leads][effect][modal|success] isModalOpen:', isModalOpen, 'success:', success, 'timer:', redirectTimeoutRef.current, 'redirected:', redirectedRef.current);
    if (success) {
      scheduleRedirect();
      if (!isModalOpen) {
        console.log('[leads][effect] Modal closed early, forcing immediate redirect');
        performRedirect();
      }
    }
    return () => {
      if (redirectTimeoutRef.current) {
        // Note: during Fast Refresh this cleanup will run; a subsequent re-mount will reschedule based on timestamp.
        console.log('[leads][cleanup] Clearing redirect timer id', redirectTimeoutRef.current);
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, [isModalOpen, success]);

    function alterRedirect(): any{
      console.log(window.location.href);
   //   var params = "";
   //   var split_v = window.location.href.split("?");
  //    if(split_v.length>1){
  //      params = "?" + split_v[1];
   //   }
   //   REDIRECT_URL = REDIRECT_URL + params;
      }

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm p-5 md:p-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between h-24">
            <div className="flex items-center space-x-2">
              <Image
                src="/FTTHorizontal-thin.webp"
                alt="Freedom Team Trading"
                width={400}
                height={151}
                className="h-10 w-auto"
                priority
                sizes="106px" /* Actual rendered width (h-10 => 40px tall, width ~106px) */
                decoding="async"
              />
            </div>
            <Button
              onClick={openModal}
              id="nav-button"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
              Book Your Free 1-on-1 Strategy Session
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <FadeIn
                as="h1"
                y={32}
                duration={0.8}
                amount={0.1}
                enterViewportOffset={0}
                className="font-serif font-black text-4xl sm:text-5xl lg:text-6xl text-foreground leading-tight">
                Become A Profitable Trader.{" "}
                <span className="text-accent">Under 1 Hour/Day.</span>
              </FadeIn>
              <FadeIn
                delay={0.2}
                amount={0.1}
                enterViewportOffset={0}
                className="text-lg max-w-xl text-white">
                Learn a simple, proven, 3-phase trading system... And master a
                better, more profitable way to trade.
              </FadeIn>
              <FadeIn delay={0.4} amount={0.1} enterViewportOffset={0}>
                <Button
                  onClick={openModal}
                  size="lg"
                  id="hero-button"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-lg px-8 py-4">
                  Book Your Free 1-on-1 Strategy Session
                </Button>
              </FadeIn>
              <FadeIn
                delay={0.6}
                amount={0.1}
                enterViewportOffset={0}
                className="text-lg text-white">
                No experience needed!
              </FadeIn>
            </div>

            <div className="relative">
              <div className="aspect-video bg-card rounded-lg overflow-hidden shadow-2xl">
                {/* Wistia Embed: Responsive 16:9 iframe */}
                <div
                  className="relative w-full h-0"
                  style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    src="https://fast.wistia.net/embed/iframe/uggxez8r8s?videoFoam=true&dnt=true"
                    title="Wistia Video"
                    allow="autoplay; fullscreen"
                    loading="lazy"
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Metrics */}
      <FadeIn
        as="section"
        y={80}
        amount={0.1}
        enterViewportOffset={0.15}
        className="py-16 bg-card"
        data-fade-id="trust-metrics">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif font-black text-3xl sm:text-4xl text-card-foreground mb-4">
              What Sets Us Apart
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-4">
                <Users className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="font-serif font-bold text-2xl text-card-foreground mb-2">
                1500+ Students
              </h3>
            </div>
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-4">
                <TrendingUp className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="font-serif font-bold text-2xl text-card-foreground mb-2">
                High Success Rate
              </h3>
            </div>
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-4">
                <DollarSign className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="font-serif font-bold text-2xl text-card-foreground mb-2">
                Millions in Profits
              </h3>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* What You'll Get Section */}
      <FadeIn
        as="section"
        y={80}
        amount={0.1}
        enterViewportOffset={0.15}
        className="py-20"
        data-fade-id="what-you-get">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif font-black text-3xl sm:text-4xl text-foreground mb-4">
              What You'll Get With Freedom Team Trading
            </h2>
            <p className="text-lg max-w-3xl mx-auto text-white">
              Stop guessing. Stop stressing. In just 8 weeks, you’ll learn a
              backtested, step-by-step trading approach that helps you grow your
              account without living at your screen. Whether you’re brand new or
              have been trading for years, our system gives you the tools,
              strategies, and mentorship you need to trade with confidence.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="bg-card border-border h-full">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-6">
                  <Target className="h-8 w-8 text-accent-foreground" />
                </div>
                <h3 className="font-serif font-bold text-xl text-card-foreground mb-4">
                  Learn a 3-phase trading system that works in any market
                  condition
                </h3>
              </CardContent>
            </Card>
            <Card className="bg-card border-border h-full">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-6">
                  <BarChart3 className="h-8 w-8 text-accent-foreground" />
                </div>
                <h3 className="font-serif font-bold text-xl text-card-foreground mb-4">
                  Use our proven “scale and compound” method to grow small
                  accounts
                </h3>
              </CardContent>
            </Card>
            <Card className="bg-card border-border h-full">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-6">
                  <DollarSign className="h-8 w-8 text-accent-foreground" />
                </div>
                <h3 className="font-serif font-bold text-xl text-card-foreground mb-4">
                  Trade with a “casino-like” statistical edge instead of emotion
                </h3>
              </CardContent>
            </Card>
            <Card className="bg-card border-border h-full">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-6">
                  <Clock className="h-8 w-8 text-accent-foreground" />
                </div>
                <h3 className="font-serif font-bold text-xl text-card-foreground mb-4">
                  Spend no more than 1 hour per day in the market
                </h3>
              </CardContent>
            </Card>
          </div>
          <div className="text-center">
            <Button
              onClick={openModal}
              size="lg"
              id="what-you-get-button"
              className="w-full h-auto md:w-auto max-w-xs sm:max-w-sm bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-base sm:text-lg px-6 py-4 whitespace-normal break-words text-center leading-snug">
              Schedule Your Free Strategy Session Now
            </Button>
          </div>
        </div>
      </FadeIn>

      {/* Real Traders, Real Results */}
      <FadeIn
        as="section"
        y={80}
        amount={0.1}
        enterViewportOffset={0.15}
        className="py-20 bg-card"
        data-fade-id="real-traders">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif font-black text-3xl sm:text-4xl text-card-foreground mb-4">
              Real Traders. Real Results.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from Freedom Team students who have transformed their trading
              and their lives.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-background border-border h-full">
              <CardContent className="p-6">
                <div className="mb-4">
                  <LazyVimeo
                    id="814064049"
                    hash="2b29cbe014"
                    title="Dylan - From Frustrated to Profitable"
                  />
                </div>
                <h3 className="font-serif font-bold text-lg text-foreground mb-2">
                  Dylan - From Frustrated to Profitable
                </h3>
                <p className="text-sm text-white">
                  "I've finally been seeing consistent gains... the strategy is
                  simple and stress-free. Joining was the best decision I've
                  made for my trading."
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background border-border h-full">
              <CardContent className="p-6">
                <div className="mb-4">
                  <LazyVimeo
                    id="813876327"
                    hash="25d5841986"
                    title="How Will Gained His Time Back With The Freedom Team"
                  />
                </div>
                <h3 className="font-serif font-bold text-lg text-foreground mb-2">
                  How Will Gained His Time Back With The Freedom Team
                </h3>
                <p className="text-sm text-white">
                  “When I first started following you… I saw it as every other
                  mentorship or group out there… but you really gave me the time
                  of day to talk to me and that really just spoke to me. All
                  these other mentorships that I had, you don’t get to know the
                  person. Having this smaller community where were all bouncing
                  ideas off each other, you’re a completely open book, I would
                  recommend this to anyone.”
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background border-border h-full">
              <CardContent className="p-6">
                <div className="mb-4">
                  <LazyVimeo
                    id="813876256"
                    hash="77751d044c"
                    title="How Eduardo Went From 4 Blown Accounts to Profitable Trader"
                  />
                </div>
                <h3 className="font-serif font-bold text-lg text-foreground mb-2">
                  How Eduardo Went From 4 Blown Accounts to Profitable Trader
                </h3>
                <p className="text-sm text-white">
                  “After taking your course I have more logical stops… so now
                  it’s much more probable for me to make money. Now when I
                  trade, I’m a lot more calm about it…. If you follow through
                  the whole course, you’re gonna make it. “
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </FadeIn>

      {/* Trading Simplified */}
      <FadeIn
        as="section"
        y={80}
        amount={0.1}
        enterViewportOffset={0.15}
        className="py-20"
        data-fade-id="trading-simplified">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif font-black text-3xl sm:text-4xl text-foreground mb-8">
              Trading Simplified
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card border-border">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-6">
                  <BarChart3 className="h-8 w-8 text-accent-foreground" />
                </div>
                <h3 className="font-serif font-bold text-xl text-card-foreground mb-4">
                  Trading. There's a Better Way.
                </h3>
                <p className="text-sm text-muted-foreground">
                  Forget the complex charts and endless strategies. Our system
                  strips trading down to what works… so you can focus on winning
                  trades and steady growth.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-6">
                  <TrendingUp className="h-8 w-8 text-accent-foreground" />
                </div>
                <h3 className="font-serif font-bold text-xl text-card-foreground mb-4">
                  Maximize Profits. Every Time.
                </h3>
                <p className="text-sm text-muted-foreground">
                  Learn exactly when to enter, when to exit, and how to lock in
                  profits using a repeatable process you can trust. And get on
                  the path to financial freedom.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-6">
                  <Target className="h-8 w-8 text-accent-foreground" />
                </div>
                <h3 className="font-serif font-bold text-xl text-card-foreground mb-4">
                  A Truly Simple Strategy.
                </h3>
                <p className="text-sm text-muted-foreground">
                  From beginner to advanced… our proven approach takes the
                  guesswork out of trading, giving you a blueprint that works
                  now and for years to come.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </FadeIn>

      {/* New CTA Section with Bonus eBook Offer */}
      <FadeIn
        as="section"
        y={80}
        amount={0.1}
        enterViewportOffset={0.15}
        className="py-20 bg-card"
        data-fade-id="cta-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 flex-wrap">
            <div className="flex-shrink-0 w-full md:w-1/3 flex justify-center mb-8 md:mb-0">
              <Image
                src="/phone-background.webp"
                alt="Options Scanner Blueprint Mobile Mockup"
                width={601}
                height={1197}
                className="w-64 md:w-56 lg:w-64 h-auto"
                sizes="(max-width: 768px) 224px, 256px" /* Matches w-56 (224px) on md and w-64 (256px) default */
                decoding="async"
                loading="lazy"
                fetchPriority="low"
              />
            </div>
            <div className="flex-1 flex flex-col justify-center text-center md:text-left">
              <h2 className="font-serif font-black text-3xl sm:text-4xl text-card-foreground mb-6">
                Book Your Free Strategy Session
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto md:mx-0">
                And Get a Rare, Insider-Level Bonus eBook Free
                <br />
                <span className="text-sm">
                  (access to strategies most traders don't share)
                </span>
              </p>
              <div className="w-full flex justify-center md:justify-start">
                <Button
                  onClick={openModal}
                  size="lg"
                  id="ebook-button"
                  className="w-full h-auto md:w-auto max-w-xs sm:max-w-sm bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-base sm:text-lg px-6 py-4 whitespace-normal break-words text-center leading-snug">
                  Schedule Your Free Strategy Session Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Final CTA */}
      <section className="py-20 bg-accent">
        <FadeIn className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-black">
          <h2 className="font-serif font-black text-3xl sm:text-4xl mb-6">
            It’s Time to Trade with Confidence
          </h2>
          <p className="text-lg font-semibold mb-8 max-w-2xl mx-auto">
            Imagine knowing, without a doubt, that every trade you take is
            backed by a system proven to be profitable. That’s what we teach.
            That’s the Freedom Team difference.
          </p>
          <Button
            onClick={openModal}
            size="lg"
            id="final-cta-button"
            className="bg-background hover:bg-background/90 text-foreground font-semibold text-lg px-8 py-4">
            Book Your Free 1-on-1 Strategy Session
          </Button>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-card border-t border-border">
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
                sizes="80px" /* h-20 => 80px tall, width auto ~80px */
                decoding="async"
                fetchPriority="low"
              />
            </div>

            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <a
                href="https://freedomteamtrade.com/privacy-policy1722628932740"
                target="_blank"
                className="hover:text-card-foreground transition-colors">
                Privacy Policy
              </a>
              <a
                href="https://freedomteamtrade.com/terms-of-service1722632412284"
                target="_blank"
                className="hover:text-card-foreground transition-colors">
                Terms & Conditions
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Freedom Team Trading. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          {!success && (
            <>
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
                    className="w-full"
                    disabled={submitting}
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
                    className="w-full"
                    disabled={submitting}
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
                    className="w-full"
                    disabled={submitting}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  id="form-submit-button"
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                  {submitting ? "Submitting..." : "Schedule My Free Session"}
                </Button>
              </form>
            </>
          )}
          {success && (
            <div
              className="flex flex-col items-center text-center space-y-6 py-4"
              aria-live="assertive">
              <div className="space-y-2">
                <h3 className="text-xl font-serif font-bold text-foreground">
                  Thank you!
                </h3>
                <p className="text-sm text-white max-w-sm">
                  The next page is where you'll book your 1-on-1 session with
                  us. Redirecting now...
                </p>
                {alterRedirect()}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
