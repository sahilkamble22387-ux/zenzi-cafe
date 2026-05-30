'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  TreePine,
  MapPin,
  Phone,
  Clock,
  Instagram,
  Star,
  Menu,
  ChevronDown,
  Leaf,
  Coffee,
  Pizza,
  Heart,
  ArrowUp,
  Mail,
  Send,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/* ───── constants ───── */
const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Menu', href: '#menu' },
  { label: 'Ambience', href: '#ambience' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#contact' },
];

const MENU_CATEGORIES = [
  {
    title: 'Signature Pizzas',
    icon: Pizza,
    items: [
      { name: 'Siciliano Sourdough', desc: 'House-made dough, fresh basil, sun-dried tomatoes, mozzarella', price: '₹449', tag: 'Bestseller' },
      { name: 'Margherita Classica', desc: 'San Marzano tomatoes, fresh buffalo mozzarella, basil', price: '₹379', tag: 'Classic' },
      { name: 'Mango Habanero Special', desc: 'Mango habanero sauce, jalapeños, mozzarella, fresh cilantro', price: '₹499', tag: 'Chef\'s Special' },
      { name: 'Truffle Mushroom', desc: 'Wild mushrooms, truffle oil, fontina, arugula', price: '₹549', tag: 'New' },
    ],
  },
  {
    title: 'Starters & Sides',
    icon: Leaf,
    items: [
      { name: 'Cheesy Jalapeño Poppers', desc: 'Crispy jalapeño poppers with habanero cheese dip', price: '₹299', tag: 'Popular' },
      { name: 'Holy Guacamole', desc: 'Fresh avocado, olives, candied walnuts, sourdough toast', price: '₹349', tag: 'Vegan' },
      { name: 'Bruschetta Trio', desc: 'Three artisan bruschetta with seasonal toppings', price: '₹329', tag: '' },
      { name: 'Garlic Bread Supreme', desc: 'Sourdough garlic bread with herb butter & cheese', price: '₹249', tag: '' },
    ],
  },
  {
    title: 'Beverages',
    icon: Coffee,
    items: [
      { name: 'Cappuccino', desc: 'Double-shot espresso with velvety steamed milk & latte art', price: '₹199', tag: 'Must Try' },
      { name: 'Matcha Latte', desc: 'Ceremonial grade matcha with oat milk', price: '₹249', tag: '' },
      { name: 'Fresh Cold Pressed Juice', desc: 'Seasonal fruits, pressed fresh daily', price: '₹179', tag: 'Healthy' },
      { name: 'Iced Caramel Mocha', desc: 'Espresso, caramel, chocolate, cold milk & ice', price: '₹269', tag: '' },
    ],
  },
];

const REVIEWS = [
  {
    name: 'Arjun M.',
    text: 'Hands down the best pizza I\'ve ever had in Pune! The crust was perfectly crisp with just the right chew, and the toppings were fresh and full of flavor.',
    rating: 5,
    source: 'Google',
  },
  {
    name: 'Priya S.',
    text: 'The ambience is warm and inviting, with comfortable seating and a relaxed atmosphere. The staff is friendly and attentive, ensuring each guest has a memorable experience.',
    rating: 5,
    source: 'Magicpin',
  },
  {
    name: 'Rahul K.',
    text: 'Tried the Siciliano sourdough pizza and it tasted amazing because all of their ingredients — dough, sauce — are made fresh in-house. Truly authentic!',
    rating: 5,
    source: 'Reddit',
  },
  {
    name: 'Sneha D.',
    text: 'The Mango Habanero Cheesy Jalapeño Poppers were bold and indulgent, the Holy Guacamole with olives & candied walnuts added a gourmet twist. Absolutely loved it!',
    rating: 5,
    source: 'Zomato',
  },
];

const HOURS = [
  { day: 'Monday – Friday', time: '10:00 AM – 11:00 PM' },
  { day: 'Saturday – Sunday', time: '9:00 AM – 11:30 PM' },
];

/* ───── tiny components ───── */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? 'fill-warm text-warm' : 'text-muted-foreground/30'}
        />
      ))}
    </div>
  );
}

/* ───── loading screen ───── */
function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [fadeout, setFadeout] = useState(false);

  useEffect(() => {
    /* simulate progress with easing */
    let frame: number;
    let start: number | null = null;
    const duration = 2200; // ms

    const animate = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const raw = Math.min(elapsed / duration, 1);
      /* ease-out cubic */
      const eased = 1 - Math.pow(1 - raw, 3);
      setProgress(Math.round(eased * 100));

      if (raw < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        /* wait a beat, then fade out */
        setTimeout(() => setFadeout(true), 200);
        setTimeout(() => onDone(), 900);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-espresso transition-opacity duration-700 ${
        fadeout ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* pulsing tree icon */}
      <div className="relative mb-8">
        <div className="absolute inset-0 animate-ping rounded-full bg-sage/20" style={{ animationDuration: '2s' }} />
        <div className="relative rounded-full bg-sage/10 p-6">
          <TreePine className="h-16 w-16 text-sage animate-pulse" style={{ animationDuration: '2s' }} />
        </div>
      </div>

      {/* brand name */}
      <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-cream mb-2 tracking-tight">
        Cafe From The Tree
      </h1>
      <p className="text-cream/50 text-sm mb-10">Koregaon Park, Pune</p>

      {/* progress bar */}
      <div className="w-48 h-1 rounded-full bg-cream/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sage to-warm transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-3 text-cream/30 text-xs tabular-nums">{progress}%</p>

      {/* floating leaves decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <Leaf
            key={i}
            className="absolute text-sage/10"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              width: `${12 + i * 4}px`,
              height: `${12 + i * 4}px`,
              animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}

/* ───── main page ───── */
export default function Home() {
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [sending, setSending] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { toast } = useToast();
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowScrollTop(window.scrollY > 600);

      /* detect active section */
      const sections = NAV_LINKS.map((l) => l.href.replace('#', ''));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    try {
      const form = new FormData(e.currentTarget);
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.get('name'),
          email: form.get('email'),
          message: form.get('message'),
        }),
      });
      if (!res.ok) throw new Error('Failed');
      toast({ title: 'Message sent!', description: "We'll get back to you soon. Thank you!" });
      (e.target as HTMLFormElement).reset();
    } catch {
      toast({ title: 'Error', description: 'Could not send message. Please try again.', variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  /* ──────────────────── RENDER ──────────────────── */
  return (
    <>
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}
      <div className={`min-h-screen flex flex-col bg-background transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {/* prevent scroll while loading */}
        {loading && <style dangerouslySetInnerHTML={{ __html: 'body{overflow:hidden}' }} />}
      {/* ─── NAVBAR ─── */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-background/90 backdrop-blur-md shadow-sm border-b border-border'
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16 sm:h-20">
          {/* Logo */}
          <button onClick={() => scrollTo('#home')} className="flex items-center gap-2 group">
            <TreePine className="h-7 w-7 text-primary transition-transform group-hover:scale-110" />
            <span
              className="font-[family-name:var(--font-playfair)] text-lg sm:text-xl font-bold text-foreground tracking-tight"
            >
              Cafe&nbsp;From&nbsp;The&nbsp;Tree
            </span>
          </button>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <button
                  onClick={() => scrollTo(l.href)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeSection === l.href.replace('#', '')
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>

          {/* CTA + Mobile */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="hidden sm:inline-flex bg-primary hover:bg-forest-light text-primary-foreground rounded-full"
              onClick={() => scrollTo('#contact')}
            >
              Reserve a Table
            </Button>

            {/* Mobile hamburger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 bg-background">
                <div className="flex flex-col gap-2 mt-8">
                  {NAV_LINKS.map((l) => (
                    <button
                      key={l.href}
                      onClick={() => scrollTo(l.href)}
                      className={`text-left px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                        activeSection === l.href.replace('#', '')
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                  <Separator className="my-2" />
                  <Button
                    className="mx-4 bg-primary hover:bg-forest-light text-primary-foreground rounded-full"
                    onClick={() => scrollTo('#contact')}
                  >
                    Reserve a Table
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>

      {/* ─── HERO ─── */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="/images/hero.png"
            alt="Cafe From The Tree outdoor terrace"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
          <Badge className="mb-4 bg-warm/20 text-warm border-warm/30 backdrop-blur-sm text-sm px-4 py-1">
            <Leaf className="h-3.5 w-3.5 mr-1.5" /> Koregaon Park, Pune
          </Badge>
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
            Where Nature Meets
            <br />
            <span className="text-warm">Great Food</span>
          </h1>
          <p className="text-white/80 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            Artisan sourdough pizzas, handcrafted coffees & Italian-inspired cuisine — served under the shade of towering trees.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-warm hover:bg-warm-dark text-white rounded-full text-base px-8"
              onClick={() => scrollTo('#menu')}
            >
              Explore Menu
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-warm/60 text-warm hover:bg-warm/10 rounded-full text-base px-8 backdrop-blur-sm"
              onClick={() => scrollTo('#contact')}
            >
              Book a Table
            </Button>
          </div>
        </div>

        {/* Scroll hint */}
        <button
          onClick={() => scrollTo('#about')}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition animate-bounce"
        >
          <ChevronDown className="h-8 w-8" />
        </button>
      </section>

      {/* ─── ABOUT ─── */}
      <section id="about" className="py-20 sm:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/images/ambience.png"
                  alt="Cafe From The Tree interior"
                  className="w-full h-[400px] sm:h-[500px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground rounded-2xl p-5 shadow-xl hidden sm:block">
                <p className="font-[family-name:var(--font-playfair)] text-3xl font-bold">5K+</p>
                <p className="text-sm text-primary-foreground/80">Happy Followers</p>
              </div>
            </div>

            {/* Text */}
            <div>
              <Badge variant="secondary" className="mb-4 text-primary">
                <TreePine className="h-3.5 w-3.5 mr-1" /> Our Story
              </Badge>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Rooted in Passion,
                <br />
                <span className="text-primary">Growing with Love</span>
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-6">
                Nestled in the heart of Koregaon Park, Cafe From The Tree is more than just a cafe — it&apos;s a sanctuary where the warmth of Italian cuisine meets the serenity of nature. Our founder&apos;s dream was simple: create a space where every meal feels like a breath of fresh air.
              </p>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8">
                From our house-made sourdough to our carefully sourced ingredients, every dish tells a story of craftsmanship and care. Whether you&apos;re here for a quiet coffee or a lively dinner with friends, we promise an experience that&apos;s as refreshing as the trees that shade our terrace.
              </p>

              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: Pizza, label: 'Sourdough Pizzas', sub: 'Made fresh daily' },
                  { icon: Coffee, label: 'Artisan Coffee', sub: 'Handcrafted brews' },
                  { icon: Leaf, label: 'Fresh Ingredients', sub: 'Locally sourced' },
                  { icon: Heart, label: 'Made with Love', sub: 'Every single time' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="rounded-lg bg-primary/10 p-2.5">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MENU ─── */}
      <section id="menu" className="py-20 sm:py-28 bg-cream dark:bg-espresso/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4 text-primary">
              <Pizza className="h-3.5 w-3.5 mr-1" /> What We Serve
            </Badge>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Our <span className="text-primary">Menu</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Every dish is crafted with love using the freshest ingredients, from our signature sourdough to our artisan beverages.
            </p>
          </div>

          {/* Food images strip */}
          <div className="grid grid-cols-3 gap-4 mb-14">
            <div className="rounded-2xl overflow-hidden shadow-lg aspect-square">
              <img src="/images/pizza.png" alt="Sourdough Pizza" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg aspect-square">
              <img src="/images/coffee.png" alt="Artisan Coffee" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg aspect-square">
              <img src="/images/starters.png" alt="Starters" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          </div>

          {/* Menu categories */}
          <div className="space-y-12">
            {MENU_CATEGORIES.map((cat) => (
              <div key={cat.title}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="rounded-xl bg-primary/10 p-2.5">
                    <cat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-bold">
                    {cat.title}
                  </h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {cat.items.map((item) => (
                    <Card
                      key={item.name}
                      className="group bg-background/80 hover:bg-background border-border/50 hover:shadow-lg transition-all duration-300"
                    >
                      <CardContent className="p-5 flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-base">{item.name}</h4>
                            {item.tag && (
                              <Badge className="text-[10px] px-1.5 py-0 bg-warm/15 text-warm-dark dark:text-warm border-0 shrink-0">
                                {item.tag}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                        </div>
                        <span className="font-[family-name:var(--font-playfair)] text-lg font-bold text-primary whitespace-nowrap">
                          {item.price}
                        </span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground text-sm mb-4">
              * Prices are indicative. Visit us for the full menu with seasonal specials.
            </p>
            <Button
              variant="outline"
              className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={() => window.open('https://www.zomato.com/pune/cafe-from-the-tree-koregaon-park', '_blank')}
            >
              View Full Menu on Zomato
            </Button>
          </div>
        </div>
      </section>

      {/* ─── AMBIENCE ─── */}
      <section id="ambience" className="py-20 sm:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4 text-primary">
              <Leaf className="h-3.5 w-3.5 mr-1" /> Feel the Vibe
            </Badge>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Our <span className="text-primary">Ambience</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Step into a world where rustic charm meets modern comfort — a space designed to make every moment memorable.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                img: '/images/ambience.png',
                title: 'Indoor Seating',
                desc: 'Cozy interiors with warm lighting, exposed brick, and lush greenery.',
              },
              {
                img: '/images/hero.png',
                title: 'Outdoor Terrace',
                desc: 'Dine under the trees with fairy lights and Pune\'s beautiful weather.',
              },
              {
                img: '/images/coffee.png',
                title: 'Coffee Corner',
                desc: 'Watch our baristas craft your perfect cup at our open coffee bar.',
              },
            ].map((item) => (
              <Card
                key={item.title}
                className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <CardContent className="p-5">
                  <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── REVIEWS ─── */}
      <section id="reviews" className="py-20 sm:py-28 bg-cream dark:bg-espresso/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4 text-primary">
              <Star className="h-3.5 w-3.5 mr-1" /> What People Say
            </Badge>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Loved by <span className="text-primary">Thousands</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Don&apos;t just take our word for it — hear from the people who make us who we are.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {REVIEWS.map((r) => (
              <Card
                key={r.name}
                className="bg-background/90 hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-6">
                  <StarRating rating={r.rating} />
                  <p className="mt-3 text-sm text-foreground/80 leading-relaxed line-clamp-4">
                    &ldquo;{r.text}&rdquo;
                  </p>
                  <Separator className="my-4" />
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm">{r.name}</p>
                    <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
                      {r.source}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button
              variant="outline"
              className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={() =>
                window.open(
                  'https://www.google.co.in/maps/place/Cafe+From+The+Tree,+KP/@18.540862,73.8873651,17z',
                  '_blank'
                )
              }
            >
              Read More Reviews on Google
            </Button>
          </div>
        </div>
      </section>

      {/* ─── CONTACT ─── */}
      <section id="contact" className="py-20 sm:py-28 bg-background" ref={contactRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4 text-primary">
              <MapPin className="h-3.5 w-3.5 mr-1" /> Get in Touch
            </Badge>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Visit <span className="text-primary">Us</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              We&apos;d love to host you. Drop by, call us, or send a message — we&apos;re always happy to hear from you.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Info + Map */}
            <div className="space-y-8">
              {/* Contact cards */}
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: MapPin,
                    title: 'Location',
                    detail: 'Koregaon Park, Pune',
                    sub: 'Maharashtra 411001',
                    action: () =>
                      window.open(
                        'https://www.google.co.in/maps/place/Cafe+From+The+Tree,+KP/@18.540862,73.8873651,17z',
                        '_blank'
                      ),
                  },
                  {
                    icon: Phone,
                    title: 'Phone',
                    detail: '+91 80104 70334',
                    sub: 'Call for reservations',
                    action: () => window.open('tel:+918010470334'),
                  },
                  {
                    icon: Clock,
                    title: 'Hours',
                    detail: 'Mon–Fri: 10 AM – 11 PM',
                    sub: 'Sat–Sun: 9 AM – 11:30 PM',
                    action: () => null,
                  },
                  {
                    icon: Instagram,
                    title: 'Instagram',
                    detail: '@cafefromthetree',
                    sub: '5K+ followers',
                    action: () => window.open('https://instagram.com/cafefromthetree', '_blank'),
                  },
                ].map((c) => (
                  <Card
                    key={c.title}
                    className="group cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                    onClick={c.action}
                  >
                    <CardContent className="p-5 flex items-start gap-4">
                      <div className="rounded-xl bg-primary/10 p-2.5 group-hover:bg-primary/20 transition-colors">
                        <c.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{c.title}</p>
                        <p className="text-sm text-foreground/80">{c.detail}</p>
                        <p className="text-xs text-muted-foreground">{c.sub}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Map embed */}
              <div className="rounded-2xl overflow-hidden shadow-lg border border-border h-[260px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.2!2d73.8873651!3d18.540862!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c1feee7fd99d%3A0x14cc84cc7519560!2sCafe%20From%20The%20Tree!5e0!3m2!1sen!2sin!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Cafe From The Tree Location"
                />
              </div>
            </div>

            {/* Contact form */}
            <Card className="shadow-xl border-border/50">
              <CardContent className="p-6 sm:p-8">
                <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-bold mb-2">
                  Send Us a Message
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Have a question or want to reserve a table? We&apos;ll get back to you shortly.
                </p>
                <form onSubmit={handleContact} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="text-sm font-medium mb-1.5 block">
                      Name
                    </label>
                    <Input id="name" name="name" placeholder="Your name" required className="rounded-lg" />
                  </div>
                  <div>
                    <label htmlFor="email" className="text-sm font-medium mb-1.5 block">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      className="rounded-lg"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="text-sm font-medium mb-1.5 block">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us what you need — reservations, private events, feedback..."
                      rows={5}
                      required
                      className="rounded-lg resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-primary hover:bg-forest-light text-primary-foreground rounded-lg py-5 text-base"
                  >
                    {sending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    {sending ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="mt-auto bg-espresso text-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <TreePine className="h-6 w-6 text-sage" />
                <span className="font-[family-name:var(--font-playfair)] text-xl font-bold text-cream">
                  Cafe From The Tree
                </span>
              </div>
              <p className="text-cream/60 text-sm leading-relaxed">
                Artisan sourdough pizzas &amp; handcrafted coffees under the trees. A cozy escape in the heart of Koregaon Park.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="font-semibold text-cream mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {NAV_LINKS.map((l) => (
                  <li key={l.href}>
                    <button
                      onClick={() => scrollTo(l.href)}
                      className="text-cream/60 hover:text-cream text-sm transition-colors"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hours */}
            <div>
              <h4 className="font-semibold text-cream mb-4">Opening Hours</h4>
              <ul className="space-y-2">
                {HOURS.map((h) => (
                  <li key={h.day} className="text-sm">
                    <p className="text-cream/60">{h.day}</p>
                    <p className="text-cream font-medium">{h.time}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-cream mb-4">Contact</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="tel:+918010470334"
                    className="flex items-center gap-2 text-cream/60 hover:text-cream text-sm transition-colors"
                  >
                    <Phone className="h-4 w-4" /> +91 80104 70334
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:hello@cafefromthetree.com"
                    className="flex items-center gap-2 text-cream/60 hover:text-cream text-sm transition-colors"
                  >
                    <Mail className="h-4 w-4" /> hello@cafefromthetree.com
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com/cafefromthetree"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-cream/60 hover:text-cream text-sm transition-colors"
                  >
                    <Instagram className="h-4 w-4" /> @cafefromthetree
                  </a>
                </li>
                <li>
                  <button
                    onClick={() =>
                      window.open(
                        'https://www.google.co.in/maps/place/Cafe+From+The+Tree,+KP/@18.540862,73.8873651,17z',
                        '_blank'
                      )
                    }
                    className="flex items-center gap-2 text-cream/60 hover:text-cream text-sm transition-colors"
                  >
                    <MapPin className="h-4 w-4" /> Koregaon Park, Pune
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="my-8 bg-cream/10" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-cream/40 text-sm">
              &copy; {new Date().getFullYear()} Cafe From The Tree. All rights reserved.
            </p>
            <p className="text-cream/40 text-xs">
              Crafted with <Heart className="inline h-3 w-3 text-warm" /> in Pune
            </p>
          </div>
        </div>
      </footer>

      {/* ─── SCROLL TO TOP ─── */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 bg-primary hover:bg-forest-light text-primary-foreground rounded-full p-3 shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
      </div>
    </>
  );
}
