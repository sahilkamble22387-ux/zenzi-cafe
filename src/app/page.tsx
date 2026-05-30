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
  UtensilsCrossed,
  MapPin,
  Phone,
  Clock,
  Star,
  Menu,
  ChevronDown,
  Flame,
  Soup,
  GlassWater,
  Heart,
  ArrowUp,
  Mail,
  Send,
  Loader2,
  Sparkles,
  Crown,
  ChefHat,
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
    title: 'Starters & Soups',
    icon: Soup,
    items: [
      { name: 'Chicken Manchow Soup', desc: 'Spicy thick soup with minced chicken, crispy noodles & fresh herbs', price: '₹199', tag: 'Popular' },
      { name: 'Paneer Tikka', desc: 'Marinated cottage cheese cubes, chargrilled in tandoor with mint chutney', price: '₹299', tag: 'Must Try' },
      { name: 'Chicken Malai Tikka', desc: 'Creamy marinated chicken, tender and succulent from the tandoor', price: '₹329', tag: 'Chef\'s Pick' },
      { name: 'Veg Spring Rolls', desc: 'Crispy rolls stuffed with seasoned vegetables & glass noodles', price: '₹229', tag: '' },
    ],
  },
  {
    title: 'Mughlai & Biryani',
    icon: Crown,
    items: [
      { name: 'Mutton Biryani', desc: 'Slow-cooked aromatic basmati rice layered with tender mutton & saffron', price: '₹449', tag: 'Signature' },
      { name: 'Chicken Biryani', desc: 'Fragrant long-grain basmati with succulent chicken & whole spices', price: '₹369', tag: 'Bestseller' },
      { name: 'Paneer Butter Masala', desc: 'Rich tomato-cream gravy with soft paneer cubes, Mughlai style', price: '₹319', tag: '' },
      { name: 'Mutton Korma', desc: 'Royal Mughlai preparation with creamy cashew & yogurt gravy', price: '₹429', tag: 'Royal' },
    ],
  },
  {
    title: 'Chinese & Schezwan',
    icon: Flame,
    items: [
      { name: 'Veg Schezwan Noodles', desc: 'Fiery Schezwan sauce tossed with hakka noodles & crunchy vegetables', price: '₹200', tag: 'Spicy' },
      { name: 'Chicken Manchurian', desc: 'Crispy chicken balls in tangy manchurian sauce, Indo-Chinese style', price: '₹319', tag: 'Popular' },
      { name: 'Veg Triple Schezwan Rice', desc: 'Spicy fried rice with schezwan sauce, mixed vegetables & chilli flakes', price: '₹220', tag: '' },
      { name: 'Chilli Chicken Dry', desc: 'Crispy chicken tossed with peppers, onions & spicy chilli sauce', price: '₹339', tag: 'Must Try' },
    ],
  },
  {
    title: 'Beverages & Desserts',
    icon: GlassWater,
    items: [
      { name: 'Fresh Lime Soda', desc: 'Refreshing sweet & salty lime with crushed ice', price: '₹99', tag: '' },
      { name: 'Mango Lassi', desc: 'Thick creamy yogurt blended with fresh mango pulp', price: '₹149', tag: 'Seasonal' },
      { name: 'Gulab Jamun', desc: 'Soft milk-solid dumplings soaked in rose-cardamom sugar syrup', price: '₹129', tag: 'Classic' },
      { name: 'Rasmalai', desc: 'Delicate paneer patties in saffron-infused sweetened milk', price: '₹149', tag: 'Must Try' },
    ],
  },
];

const REVIEWS = [
  {
    name: 'Amit P.',
    text: 'Absolutely amazing food! The mutton biryani is to die for — perfectly layered with aromatic rice and tender meat. The Mughlai flavors are authentic and rich.',
    rating: 5,
    source: 'JustDial',
  },
  {
    name: 'Neha R.',
    text: 'Great place for family dining. Comforting atmosphere, healthy and delicious food with good quality. The staff is courteous and the service is prompt.',
    rating: 5,
    source: 'Zomato',
  },
  {
    name: 'Vikram S.',
    text: 'The corn soup with Cantonese base is incredible! Their Indo-Chinese is some of the best in Pune. Chilli chicken and Manchurian are must-tries.',
    rating: 5,
    source: 'Google',
  },
  {
    name: 'Pooja M.',
    text: 'Warm atmosphere and attentive service — ZENZI is a must-visit. The paneer butter masala and naan combo is heavenly. Will keep coming back!',
    rating: 5,
    source: 'Swiggy',
  },
];

const HOURS = [
  { day: 'Monday – Sunday', time: '11:00 AM – 11:30 PM' },
];

/* ───── tiny components ───── */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? 'fill-gold text-gold' : 'text-muted-foreground/30'}
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
    let frame: number;
    let start: number | null = null;
    const duration = 2200;

    const animate = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const raw = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - raw, 3);
      setProgress(Math.round(eased * 100));

      if (raw < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        setTimeout(() => setFadeout(true), 200);
        setTimeout(() => onDone(), 900);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-charcoal transition-opacity duration-700 ${
        fadeout ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Animated crown icon */}
      <div className="relative mb-8">
        <div className="absolute inset-0 animate-ping rounded-full bg-gold/20" style={{ animationDuration: '2s' }} />
        <div className="relative rounded-full bg-gold/10 p-6">
          <Crown className="h-16 w-16 text-gold animate-pulse" style={{ animationDuration: '2s' }} />
        </div>
      </div>

      {/* Brand name with glow */}
      <h1
        className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl font-bold text-cream mb-1 tracking-widest"
        style={{ animation: 'glow 3s ease-in-out infinite' }}
      >
        ZENZI
      </h1>
      <p className="text-gold/60 text-sm tracking-[0.3em] mb-10">RESTAURANT &nbsp; CAFE</p>

      {/* Progress bar */}
      <div className="w-52 h-0.5 rounded-full bg-cream/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-gold to-saffron transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-3 text-cream/20 text-xs tabular-nums">{progress}%</p>

      {/* Decorative sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <Sparkles
            key={i}
            className="absolute text-gold/10"
            style={{
              left: `${10 + i * 16}%`,
              top: `${15 + (i % 3) * 28}%`,
              width: `${14 + i * 3}px`,
              height: `${14 + i * 3}px`,
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

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowScrollTop(window.scrollY > 600);

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
      toast({ title: 'Message sent!', description: "We'll get back to you shortly. Thank you!" });
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

  return (
    <>
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}
      <div className={`min-h-screen flex flex-col bg-background transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}>
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
          <button onClick={() => scrollTo('#home')} className="flex items-center gap-2.5 group">
            <Crown className="h-6 w-6 text-gold transition-transform group-hover:scale-110" />
            <span className="font-[family-name:var(--font-playfair)] text-xl sm:text-2xl font-bold text-foreground tracking-[0.15em]">
              ZENZI
            </span>
          </button>

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

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="hidden sm:inline-flex bg-primary hover:bg-burgundy-light text-primary-foreground rounded-full"
              onClick={() => scrollTo('#contact')}
            >
              Reserve a Table
            </Button>

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
                    className="mx-4 bg-primary hover:bg-burgundy-light text-primary-foreground rounded-full"
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
        <div className="absolute inset-0">
          <img
            src="/images/zenzi/hero.png"
            alt="ZENZI Restaurant Cafe exterior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/50 to-charcoal/80" />
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
          <Badge className="mb-5 bg-gold/20 text-gold border-gold/30 backdrop-blur-sm text-sm px-4 py-1 tracking-wider">
            <Crown className="h-3.5 w-3.5 mr-1.5" /> EST. IN PUNE
          </Badge>
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl sm:text-6xl md:text-8xl font-bold text-cream leading-tight mb-6 tracking-wider"
            style={{ animation: 'glow 3s ease-in-out infinite' }}
          >
            ZENZI
          </h1>
          <p className="text-gold/80 text-lg sm:text-xl tracking-[0.3em] mb-4 font-light">
            RESTAURANT &nbsp;&bull;&nbsp; CAFE
          </p>
          <p className="text-cream/70 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Where royal Mughlai flavors meet contemporary dining. North Indian, Chinese, Biryani & Seafood — crafted for the connoisseur.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gold hover:bg-gold-light text-charcoal rounded-full text-base px-8 font-semibold"
              onClick={() => scrollTo('#menu')}
            >
              Explore Menu
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-gold/50 text-gold hover:bg-gold/10 rounded-full text-base px-8 backdrop-blur-sm"
              onClick={() => scrollTo('#contact')}
            >
              Book a Table
            </Button>
          </div>
        </div>

        <button
          onClick={() => scrollTo('#about')}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cream/50 hover:text-cream transition animate-bounce"
        >
          <ChevronDown className="h-8 w-8" />
        </button>
      </section>

      {/* ─── ABOUT ─── */}
      <section id="about" className="py-20 sm:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/images/zenzi/ambience.png"
                  alt="ZENZI Restaurant interior"
                  className="w-full h-[400px] sm:h-[500px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground rounded-2xl p-5 shadow-xl hidden sm:block">
                <p className="font-[family-name:var(--font-playfair)] text-3xl font-bold">4.9</p>
                <p className="text-sm text-primary-foreground/80 flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" /> Rating on JustDial
                </p>
              </div>
            </div>

            <div>
              <Badge variant="secondary" className="mb-4 text-primary">
                <Sparkles className="h-3.5 w-3.5 mr-1" /> Our Story
              </Badge>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                A Culinary
                <br />
                <span className="text-primary">Royal Affair</span>
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-6">
                ZENZI Restaurant Cafe is where tradition meets modern elegance. Nestled on Dhole Patil Road in the heart of Pune, we bring you the finest North Indian, Mughlai, and Indo-Chinese cuisine — each dish a masterpiece of flavor and craft.
              </p>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8">
                From our aromatic biryanis slow-cooked with saffron to our sizzling Schezwan specials, every plate at ZENZI tells a story of passion, quality ingredients, and culinary excellence. Whether it&apos;s a family dinner or a celebration, we make every meal memorable.
              </p>

              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: Crown, label: 'Mughlai Heritage', sub: 'Royal recipes' },
                  { icon: ChefHat, label: 'Master Chefs', sub: 'Expertly crafted' },
                  { icon: Flame, label: 'Indo-Chinese', sub: 'Fiery & flavorful' },
                  { icon: Heart, label: 'Family Friendly', sub: 'Warm & welcoming' },
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
      <section id="menu" className="py-20 sm:py-28 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4 text-primary">
              <UtensilsCrossed className="h-3.5 w-3.5 mr-1" /> Our Cuisine
            </Badge>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              The <span className="text-primary">Menu</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              From royal Mughlai delicacies to fiery Indo-Chinese — every dish is a celebration of flavor, made with the freshest ingredients.
            </p>
          </div>

          {/* Food images strip */}
          <div className="grid grid-cols-3 gap-4 mb-14">
            <div className="rounded-2xl overflow-hidden shadow-lg aspect-square">
              <img src="/images/zenzi/food1.png" alt="Mughlai Cuisine" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg aspect-square">
              <img src="/images/zenzi/food2.png" alt="Indo-Chinese" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg aspect-square">
              <img src="/images/zenzi/drinks.png" alt="Beverages & Desserts" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
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
                              <Badge className="text-[10px] px-1.5 py-0 bg-gold/15 text-saffron border-0 shrink-0">
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
              onClick={() => window.open('https://www.zomato.com/pune/zenzi-cafe-dhole-patil-road', '_blank')}
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
              <Sparkles className="h-3.5 w-3.5 mr-1" /> Experience
            </Badge>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Our <span className="text-primary">Ambience</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              A space where elegance meets warmth — designed for unforgettable evenings with family and friends.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                img: '/images/zenzi/ambience.png',
                title: 'Indoor Elegance',
                desc: 'Plush seating, warm pendant lights, and contemporary Indian decor for an intimate dining experience.',
              },
              {
                img: '/images/zenzi/hero.png',
                title: 'Outdoor Lounge',
                desc: 'Al fresco seating with ambient lighting — perfect for Pune\'s beautiful evenings.',
              },
              {
                img: '/images/zenzi/drinks.png',
                title: 'Bar & Beverages',
                desc: 'Expertly crafted mocktails, fresh juices, and classic beverages to complement your meal.',
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
      <section id="reviews" className="py-20 sm:py-28 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4 text-primary">
              <Star className="h-3.5 w-3.5 mr-1" /> Testimonials
            </Badge>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              What Our <span className="text-primary">Guests Say</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Rated 4.9 on JustDial with over 1,100 reviews — our guests speak for us.
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
                  'https://www.google.co.in/maps/place/ZENZI+Restaurant+Cafe/@18.5356005,73.8749616,17z',
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
      <section id="contact" className="py-20 sm:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4 text-primary">
              <MapPin className="h-3.5 w-3.5 mr-1" /> Get in Touch
            </Badge>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Visit <span className="text-primary">Us</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              We&apos;d love to host you. Reserve a table or drop by — every visit to ZENZI is special.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: MapPin,
                    title: 'Location',
                    detail: 'Dhole Patil Road, Pune',
                    sub: 'Near Tadiwala Road',
                    action: () =>
                      window.open(
                        'https://www.google.co.in/maps/place/ZENZI+Restaurant+Cafe/@18.5356005,73.8749616,17z',
                        '_blank'
                      ),
                  },
                  {
                    icon: Phone,
                    title: 'Phone',
                    detail: '+91 75173 28661',
                    sub: 'Call for reservations',
                    action: () => window.open('tel:+917517328661'),
                  },
                  {
                    icon: Clock,
                    title: 'Hours',
                    detail: 'Open 7 Days a Week',
                    sub: '11:00 AM – 11:30 PM',
                    action: () => null,
                  },
                  {
                    icon: UtensilsCrossed,
                    title: 'Cuisines',
                    detail: 'North Indian, Mughlai',
                    sub: 'Chinese, Seafood, Kebab',
                    action: () => null,
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

              <div className="rounded-2xl overflow-hidden shadow-lg border border-border h-[260px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.2!2d73.8749616!3d18.5356005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c1f483072a41%3A0x1bfda927ae5b2fc3!2sZENZI%20Restaurant%20Cafe!5e0!3m2!1sen!2sin!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="ZENZI Restaurant Cafe Location"
                />
              </div>
            </div>

            <Card className="shadow-xl border-border/50">
              <CardContent className="p-6 sm:p-8">
                <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-bold mb-2">
                  Reserve a Table
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Planning a visit? Send us your details and we&apos;ll confirm your reservation.
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
                      placeholder="Tell us — date, time, number of guests, special requests..."
                      rows={5}
                      required
                      className="rounded-lg resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-primary hover:bg-burgundy-light text-primary-foreground rounded-lg py-5 text-base"
                  >
                    {sending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    {sending ? 'Sending...' : 'Reserve Now'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="mt-auto bg-charcoal text-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <Crown className="h-6 w-6 text-gold" />
                <span className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-cream tracking-wider">
                  ZENZI
                </span>
              </div>
              <p className="text-cream/50 text-sm leading-relaxed">
                Premium North Indian, Mughlai, Chinese & Seafood dining in the heart of Pune. A culinary experience like no other.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-cream mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {NAV_LINKS.map((l) => (
                  <li key={l.href}>
                    <button
                      onClick={() => scrollTo(l.href)}
                      className="text-cream/50 hover:text-cream text-sm transition-colors"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-cream mb-4">Opening Hours</h4>
              <ul className="space-y-2">
                {HOURS.map((h) => (
                  <li key={h.day} className="text-sm">
                    <p className="text-cream/50">{h.day}</p>
                    <p className="text-cream font-medium">{h.time}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-cream mb-4">Contact</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="tel:+917517328661"
                    className="flex items-center gap-2 text-cream/50 hover:text-cream text-sm transition-colors"
                  >
                    <Phone className="h-4 w-4" /> +91 75173 28661
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@zenzicafe.com"
                    className="flex items-center gap-2 text-cream/50 hover:text-cream text-sm transition-colors"
                  >
                    <Mail className="h-4 w-4" /> info@zenzicafe.com
                  </a>
                </li>
                <li>
                  <button
                    onClick={() =>
                      window.open(
                        'https://www.google.co.in/maps/place/ZENZI+Restaurant+Cafe/@18.5356005,73.8749616,17z',
                        '_blank'
                      )
                    }
                    className="flex items-center gap-2 text-cream/50 hover:text-cream text-sm transition-colors"
                  >
                    <MapPin className="h-4 w-4" /> Dhole Patil Road, Pune
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="my-8 bg-cream/10" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-cream/30 text-sm">
              &copy; {new Date().getFullYear()} ZENZI Restaurant Cafe. All rights reserved.
            </p>
            <p className="text-cream/30 text-xs">
              Crafted with <Heart className="inline h-3 w-3 text-gold" /> in Pune
            </p>
          </div>
        </div>
      </footer>

      {/* ─── SCROLL TO TOP ─── */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 bg-primary hover:bg-burgundy-light text-primary-foreground rounded-full p-3 shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}

      </div>
    </>
  );
}
