"use client";

import React, { useState } from "react";
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

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        console.error("Failed to submit");
        setSubmitting(false);
        return;
      }
      const data = await res.json();
      if (!data?.success) {
        console.error("API did not return success");
        setSubmitting(false);
        return;
      }
      setIsModalOpen(false);
      setFormData({ firstName: "", lastName: "", email: "" });
      window.location.href = "https://freedomteamtrade.com/3-schedule-page1682423104339?sl=result";
    } catch (err) {
      console.error("Submission error", err);
      setSubmitting(false);
    }
  };

  const openModal = () => setIsModalOpen(true);

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
              />
            </div>
            <Button
              onClick={openModal}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            >
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
              <h1 className="font-serif font-black text-4xl sm:text-5xl lg:text-6xl text-foreground leading-tight">
                Become A Profitable Trader.{" "}
                <span className="text-accent">Under 1 Hour/Day.</span>
              </h1>
              <p className="text-lg max-w-xl text-white">
                Learn to trade, master 3 simple trading systems. And become a
                trader that can trade any market.
              </p>
              <Button
                onClick={openModal}
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-lg px-8 py-4"
              >
                Book Your Free 1-on-1 Strategy Session
              </Button>
              <p className="text-sm text-white">No experience needed!</p>
            </div>

            <div className="relative">
              <div className="aspect-video bg-card rounded-lg overflow-hidden shadow-2xl">
                {/* Wistia Embed: Responsive 16:9 iframe */}
                <div
                  className="relative w-full h-0"
                  style={{ paddingBottom: "56.25%" }}
                >
                  <iframe
                    src="https://fast.wistia.net/embed/iframe/uggxez8r8s?videoFoam=true"
                    title="Wistia Video"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                    frameBorder="0"
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Metrics */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif font-black text-3xl sm:text-4xl text-card-foreground mb-4">
              What Sets Us Apart
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-4">
                <Users className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="font-serif font-bold text-2xl text-card-foreground mb-2">
                1500+ Students
              </h3>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-4">
                <TrendingUp className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="font-serif font-bold text-2xl text-card-foreground mb-2">
                High Success Rate
              </h3>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-4">
                <DollarSign className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="font-serif font-bold text-2xl text-card-foreground mb-2">
                Millions in Profits
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Get Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif font-black text-3xl sm:text-4xl text-foreground mb-4">
              What You'll Get With Freedom Team Trading
            </h2>
            <p className="text-lg max-w-3xl mx-auto text-white">
              Stop guessing. Stop dreaming. In just 5 weeks, you'll learn a
              step-by-step, step-by-step trading approach that works on your
              account without losing all your money. Whether you're brand new to
              trading or have been trading for years, this is the system you
              need.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="bg-card border-border">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-6">
                  <Target className="h-8 w-8 text-accent-foreground" />
                </div>
                <h3 className="font-serif font-bold text-xl text-card-foreground mb-4">
                  Learn a 3 phase trading system that works in any trading
                  situation
                </h3>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-6">
                  <BarChart3 className="h-8 w-8 text-accent-foreground" />
                </div>
                <h3 className="font-serif font-bold text-xl text-card-foreground mb-4">
                  Use our proven "scale and compound" method to grow your
                  account
                </h3>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-6">
                  <DollarSign className="h-8 w-8 text-accent-foreground" />
                </div>
                <h3 className="font-serif font-bold text-xl text-card-foreground mb-4">
                  Trade with a "casino-like" statistical edge instead of emotion
                </h3>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
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
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-lg px-8 py-4"
            >
              Schedule Your Free Strategy Session Now
            </Button>
          </div>
        </div>
      </section>

      {/* Real Traders, Real Results */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif font-black text-3xl sm:text-4xl text-card-foreground mb-4">
              Real Traders, Real Results
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from Freedom Team members who have transformed their trading
              and their lives.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-background border-border">
              <CardContent className="p-6">
                <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
                  <iframe
                    src="https://www.youtube.com/embed/EngW7tLk6R8"
                    title="Dylan - From Frustrated to Profitable"
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <h3 className="font-serif font-bold text-lg text-foreground mb-2">
                  Dylan - From Frustrated to Profitable
                </h3>
                <p className="text-sm text-white">
                  "I've finally been seeing consistent gains. The strategy is
                  simple and works. Risk management is key and I've learned to
                  control my emotions when making trading decisions. I've made
                  so much progress in my trading."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background border-border">
              <CardContent className="p-6">
                <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
                  <iframe
                    src="https://www.youtube.com/embed/EngW7tLk6R8"
                    title="Dylan - From Frustrated to Profitable"
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <h3 className="font-serif font-bold text-lg text-foreground mb-2">
                  Dylan - From Frustrated to Profitable
                </h3>
                <p className="text-sm text-white">
                  "I've finally been seeing consistent gains. The strategy is
                  simple and works. Risk management is key and I've learned to
                  control my emotions when making trading decisions. I've made
                  so much progress in my trading."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background border-border">
              <CardContent className="p-6">
                <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
                  <iframe
                    src="https://www.youtube.com/embed/EngW7tLk6R8"
                    title="Dylan - From Frustrated to Profitable"
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <h3 className="font-serif font-bold text-lg text-foreground mb-2">
                  Dylan - From Frustrated to Profitable
                </h3>
                <p className="text-sm text-white">
                  "I've finally been seeing consistent gains. The strategy is
                  simple and works. Risk management is key and I've learned to
                  control my emotions when making trading decisions. I've made
                  so much progress in my trading."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trading Simplified */}
      <section className="py-20">
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
      </section>

      {/* New CTA Section with Bonus eBook Offer */}

      <section className="py-20 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 flex-wrap">
            {/* Image: mobile mockup */}
            <div className="flex-shrink-0 w-full md:w-1/3 flex justify-center mb-8 md:mb-0">
              <img
                src="/phone-background.webp"
                alt="Options Scanner Blueprint Mobile Mockup"
                className="w-64 md:w-56 lg:w-64 h-auto"
                style={{ maxWidth: "100%" }}
              />
            </div>
            {/* Text & CTA */}
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
              <Button
                onClick={openModal}
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-lg px-8 py-4"
              >
                Schedule Your Free Strategy Session Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-accent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif font-black text-3xl sm:text-4xl text-accent-foreground mb-6">
            Ready to Transform Your Trading?
          </h2>
          <p className="text-lg text-accent-foreground/90 mb-8 max-w-2xl mx-auto">
            Join thousands of successful traders who have mastered our proven
            3-step system. Book your free strategy session today.
          </p>
          <Button
            onClick={openModal}
            size="lg"
            className="bg-background hover:bg-background/90 text-foreground font-semibold text-lg px-8 py-4"
          >
            Book Your Free 1-on-1 Strategy Session
          </Button>
        </div>
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
              />
            </div>

            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <a
                href="/privacy-policy"
                className="hover:text-card-foreground transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/terms-conditions"
                className="hover:text-card-foreground transition-colors"
              >
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
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            >
              Schedule My Free Session
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
