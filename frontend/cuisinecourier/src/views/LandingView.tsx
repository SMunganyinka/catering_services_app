import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronRight, Quote,
  Star,  
  CheckCircle,
  Building2, Globe, Landmark, Plane, Sparkles, Loader2
} from 'lucide-react';

// --- Types ---
interface LandingViewProps {
  onGetStarted: () => void;
  onViewMenus?: () => void;
}

interface Slide {
  id: number;
  src: string;
  title: string;
  subtitle: string;
}

interface PortfolioItem {
  id: number;
  type: 'Wedding' | 'Corporate' | 'Private' | 'Social';
  src: string;
  title: string;
}

interface Partner {
  name: string;
  icon: React.ElementType;
}

// ADDED: Service interface to fix 'any' type error
interface Service {
  id: number;
  name: string;
  description: string;
  price_per_person: number;
  image_url?: string;
  provider_id: number;
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  user_name: string;
  service_name?: string;
  created_at: string;
}

// --- Helper: Scroll Reveal Component ---
const ScrollReveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => setIsVisible(entry.isIntersecting));
    });
    const current = domRef.current;
    if (current) observer.observe(current);
    return () => { if (current) observer.unobserve(current); };
  }, []);

  return (
    <div 
      ref={domRef} 
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`}
    >
      {children}
    </div>
  );
};

// --- Data ---
const HERO_SLIDES: Slide[] = [
  {
    id: 1,
    src: "/8.png",
    title: "Timeless Weddings",
    subtitle: "Creating fairytales, one plate at a time."
  },
  {
    id: 2,
    src: "/9.png", 
    title: "Executive Galas",
    subtitle: "Precision catering for the business elite."
  },
  {
    id: 3,
    src: "/10.png", 
    title: "Private Chef Experiences",
    subtitle: "Michelin-star quality in the comfort of your home."
  }
];

const SERVICE_TIERS = [
  {
    name: "Silver",
    price: "RWF 2,000,000",
    color: "from-gray-50 to-gray-100",
    textColor: "text-gray-800",
    borderColor: "border-gray-200",
    features: ["Premium Buffet Setup", "Standard Linens", "Soft Drinks", "4 Hour Service"]
  },
  {
    name: "Gold",
    price: "RWF 3,000,000",
    featured: true,
    color: "from-yellow-50 to-orange-50",
    textColor: "text-yellow-900",
    borderColor: "border-yellow-400",
    features: ["Plated Service", "Premium Linens", "House Wine & Beer", "6 Hour Service", "Event Coordinator"]
  },
  {
    name: "Diamond",
    price: "RWF 5,000,000",
    color: "from-cyan-50 to-blue-50",
    textColor: "text-cyan-900",
    borderColor: "border-cyan-300",
    features: ["Full White Glove Service", "Custom Menu Design", "Top-shelf Bar", "Unlimited Hours", "Live Cooking Station"]
  }
];

const PORTFOLIO_ITEMS: PortfolioItem[] = [
  { id: 1, type: "Wedding", src: "/4.png", title: "The Rose Garden Wedding" },
  { id: 2, type: "Corporate", src: "/5.png", title: "Tech Summit Gala" },
  { id: 3, type: "Private", src: "/6.png", title: "Anniversary Dinner" },
  { id: 4, type: "Social", src: "/7.png", title: "Birthday party" },
  { id: 5, type: "Wedding", src: "/1.png", title: "Private Dinner" },
  { id: 6, type: "Corporate", src: "/3.png", title: "Product Launch" },
];

const PARTNERS: Partner[] = [
  { name: "Kigali Marriott", icon: Building2 },
  { name: "RDB Events", icon: Globe },
  { name: "I&M Bank", icon: Landmark },
  { name: "RwandaAir", icon: Plane },
  { name: "Radisson Blu", icon: Building2 }, 
  { name: "UTB", icon: Globe }
];

// --- Main Component ---
const LandingView: React.FC<LandingViewProps> = ({ onGetStarted, onViewMenus }) => {
  
  // --- Hero Logic ---
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(interval);
  }, []);

  // --- Portfolio Filter Logic ---
  const [filter, setFilter] = useState<string>('All');
  const filteredPortfolio = filter === 'All' ? PORTFOLIO_ITEMS : PORTFOLIO_ITEMS.filter(item => item.type === filter);

  // --- Booking Widget Logic ---
  const [bookingStep, setBookingStep] = useState(1);

  // --- DYNAMIC REVIEWS LOGIC ---
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const API_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const sRes = await fetch(`${API_URL}/services/`);
        if (!sRes.ok) return;
        
        // FIXED: Cast to Service[] to avoid 'any' type error
        const services = await sRes.json() as Service[];

        const featuredServices = services.slice(0, 3);

        const reviewPromises = featuredServices.map((service: Service) => 
          fetch(`${API_URL}/services/${service.id}/reviews`)
            .then(res => res.ok ? res.json() : [])
            .then((revList: Review[]) => revList.map((r) => ({ ...r, service_name: service.name, service_id: service.id })))
        );

        const allReviews = await Promise.all(reviewPromises);
        const flattenedReviews = allReviews.flat();
        
        if (flattenedReviews.length > 0) {
            setReviews(flattenedReviews.slice(0, 3));
        } else {
            setReviews([]);
        }
      } catch (err) {
        console.error("Failed to load reviews", err);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, []);
  
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(1deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          .scribble-underline {
            border-bottom: 2px solid #D97706;
            border-radius: 2px;
            padding-bottom: 4px;
            display: inline-block;
          }
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
        `
      }} />

      <div className="flex flex-col text-stone-800 bg-white font-sans selection:bg-yellow-200">
        
        {/* --- 1. HERO SECTION --- */}
        <section className="relative w-full min-h-175 flex items-center justify-center bg-[#FFFBEB] overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-yellow-200/40 rounded-full blur-[80px] animate-float"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-orange-100/40 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }}></div>

          <div className="container mx-auto px-6 sm:px-12 lg:px-20 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            <div className="order-2 lg:order-1 max-w-xl space-y-6">
              <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl text-stone-800 leading-[1.1] tracking-tight">
                Food is the <br />
                <span className="scribble-underline inline-block text-stone-900">language of</span> <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-600 to-orange-600 italic font-medium">
                  love.
                </span>
              </h1>
              
              <p className="text-lg text-stone-600 font-serif leading-relaxed">
                We don't just serve meals; we craft memories. Every ingredient is chosen with care, every dish tells a story, and every event becomes a cherished moment.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button onClick={onGetStarted} className="group relative bg-stone-800 text-white px-8 py-4 rounded-full text-base sm:text-lg font-medium shadow-lg shadow-stone-800/20 hover:shadow-stone-800/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2 overflow-hidden">
                  <span className="relative z-10">Start Your Story</span>
                  <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ease-out z-0"></div>
                </button>
                
                <button onClick={onViewMenus} className="bg-white border-2 border-amber-300 text-stone-800 hover:border-amber-400 hover:text-stone-900 px-8 py-4 rounded-full text-base sm:text-lg font-medium transition-all flex items-center justify-center gap-2 hover:bg-amber-50">
                  View Services
                </button>
              </div>
            </div>

            <div className="order-1 lg:order-2 flex justify-center lg:justify-end perspective-1000">
              <div className="relative w-full max-w-md animate-float">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-white/60 backdrop-blur-md rotate-1 shadow-sm z-20 rounded-sm"></div>
                <div className="relative bg-white p-4 rounded-4xl shadow-2xl shadow-yellow-900/10 border border-white rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-stone-100">
                    {HERO_SLIDES.map((slide, index) => (
                      <div
                        key={slide.id}
                        className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                      >
                        <img src={slide.src} alt={slide.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-orange-900/5 mix-blend-overlay"></div>
                      </div>
                    ))}
                    <div className="absolute bottom-4 right-4 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-sm backdrop-blur-sm">
                       <Star className="w-5 h-5 text-yellow-500 fill-yellow-400" />
                    </div>
                  </div>
                  <div className="mt-4 px-2 pb-2">
                     <div className="h-2 w-24 bg-stone-200 rounded-full mb-2"></div>
                     <div className="h-2 w-16 bg-stone-100 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* --- 2. TRUSTED BY PARTNERS --- */}
        <section className="py-12 bg-white border-b border-stone-100 overflow-hidden relative">
          <div className="text-center mb-8 relative z-10">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.3em] mb-2">Proudly Partnered With</p>
          </div>
          
          <div className="relative w-full max-w-[90vw] mx-auto overflow-hidden">
             <div className="flex animate-marquee whitespace-nowrap">
               {[...PARTNERS, ...PARTNERS].map((partner, idx) => {
                  const Icon = partner.icon;
                  return (
                    <div key={idx} className="flex items-center gap-3 mx-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-default">
                      <Icon className="w-8 h-8 text-stone-600" />
                      <span className="text-sm font-bold text-stone-600 whitespace-nowrap">{partner.name}</span>
                    </div>
                  );
               })}
             </div>
             <div className="absolute top-0 left-0 w-20 h-full bg-linear-to-r from-white to-transparent z-10"></div>
             <div className="absolute top-0 right-0 w-20 h-full bg-linear-to-l from-white to-transparent z-10"></div>
          </div>
        </section>

        {/* --- 3. SERVICE TIERS PREVIEW --- */}
        <section className="py-20 sm:py-28 px-4 sm:px-6 bg-[#FFFBEB] relative">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-yellow-200 text-yellow-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
                  <Sparkles size={12} /> Premium Packages
                </div>
                <h2 className="font-serif text-4xl sm:text-5xl font-bold text-stone-800 mt-2">Choose Your Experience</h2>
                <button
                  onClick={onViewMenus}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-amber-500 hover:text-stone-900 transition-colors"
                >
                  View All Services
                </button>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {SERVICE_TIERS.map((tier) => (
                <div 
                  key={tier.name}
                  className={`relative rounded-4xl p-8 border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col ${tier.borderColor} ${
                    tier.featured 
                    ? 'bg-white border-yellow-300 shadow-lg z-10 scale-105' 
                    : 'bg-white/50 border-stone-100 hover:border-yellow-100'
                  }`}
                >
                  {tier.featured && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-stone-800 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wide shadow-lg whitespace-nowrap flex items-center gap-1">
                      <Star size={10} fill="currentColor" /> Most Popular
                    </div>
                  )}
                  <div className="text-center mb-8 pt-2">
                    <h3 className={`font-serif text-2xl font-bold mb-2 ${tier.textColor}`}>{tier.name}</h3>
                    <div className={`font-sans text-3xl font-bold ${tier.textColor}`}>{tier.price}</div>
                  </div>
                  <ul className="space-y-4 mb-8 flex-1">
                    {tier.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-medium text-stone-600">
                        <div className={`p-1 rounded-full ${tier.featured ? 'bg-yellow-100 text-yellow-600' : 'bg-stone-100 text-stone-500'}`}>
                          <CheckCircle className="w-4 h-4" />
                        </div>
                        <span className="leading-relaxed font-sans">{feat}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={onViewMenus}
                    className={`w-full py-4 rounded-xl font-sans font-bold text-sm uppercase tracking-wide transition-all shadow-sm hover:shadow-md ${
                      tier.featured
                        ? 'bg-amber-500 text-stone-900 hover:bg-amber-400'
                        : 'bg-white text-stone-900 border border-stone-300 hover:bg-stone-900 hover:text-white'
                    }`}
                  >
                    Select {tier.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- 4. PORTFOLIO HIGHLIGHTS --- */}
        <section className="py-20 sm:py-28 px-4 sm:px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <ScrollReveal>
                <div>
                  <span className="text-yellow-600 font-bold tracking-widest uppercase text-xs">Our Portfolio</span>
                  <h2 className="font-serif text-4xl sm:text-5xl font-bold text-stone-800 mt-2">Moments We've Crafted</h2>
                </div>
              </ScrollReveal>
              
              <div className="flex bg-[#FFFBEB] p-1.5 rounded-2xl shadow-sm border border-stone-100 overflow-x-auto w-full md:w-auto">
                {['All', 'Wedding', 'Corporate', 'Private', 'Social'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap font-sans ${
                      filter === cat 
                      ? 'bg-white text-stone-800 shadow-md' 
                      : 'text-stone-500 hover:text-stone-900 hover:bg-white/50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <ScrollReveal delay={100}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPortfolio.map((item) => (
                  <div key={item.id} className="group relative overflow-hidden rounded-4xl aspect-4/3 cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 bg-stone-50">
                    <img src={item.src} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-linear-to-t from-stone-900/90 via-stone-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                      <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">{item.type}</span>
                      <h3 className="text-white text-2xl font-serif font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">{item.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* --- 5. QUICK BOOKING WIDGET --- */}
        <section className="py-24 px-4 sm:px-6 bg-stone-800 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-black/60 to-transparent pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-600/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-5xl mx-auto relative z-10">
            <ScrollReveal>
              <div className="text-center mb-12">
                <div className="inline-block px-4 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full mb-6 font-sans">Quick Reservation</div>
                <h2 className="font-serif text-3xl sm:text-5xl font-bold mb-4">Secure Your Date</h2>
                <p className="text-stone-400 max-w-lg mx-auto font-serif">Experience seamless booking. Select your preferences below and check availability instantly.</p>
              </div>

              <div className="flex flex-col lg:flex-row gap-4 items-stretch bg-stone-700/50 p-2 rounded-3xl backdrop-blur-sm border border-stone-600/50 shadow-2xl">
                
                <div className={`flex-1 rounded-2xl p-6 border transition-all duration-300 cursor-pointer hover:border-yellow-500/50 ${bookingStep >= 1 ? 'bg-stone-800 border-yellow-500 shadow-lg' : 'bg-transparent border-transparent hover:bg-stone-800/50'}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg transition-colors ${bookingStep >= 1 ? 'bg-yellow-500 text-black' : 'bg-stone-700 text-stone-400'}`}>1</div>
                    <span className="font-bold text-lg font-sans">Select Date</span>
                  </div>
                  <input type="date" className="w-full bg-stone-900/50 border border-stone-600 rounded-xl p-3 text-white focus:border-yellow-500 outline-none focus:ring-1 focus:ring-yellow-500 transition-all text-lg font-sans" onFocus={() => setBookingStep(1)} />
                </div>

                <div className={`flex-1 rounded-2xl p-6 border transition-all duration-300 cursor-pointer hover:border-yellow-500/50 ${bookingStep >= 2 ? 'bg-stone-800 border-yellow-500 shadow-lg' : 'bg-transparent border-transparent hover:bg-stone-800/50'}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg transition-colors ${bookingStep >= 2 ? 'bg-yellow-500 text-black' : 'bg-stone-700 text-stone-400'}`}>2</div>
                    <span className="font-bold text-lg font-sans">Guests</span>
                  </div>
                  <select className="w-full bg-stone-900/50 border border-stone-600 rounded-xl p-3 text-white focus:border-yellow-500 outline-none focus:ring-1 focus:ring-yellow-500 transition-all text-lg font-sans appearance-none" onFocus={() => setBookingStep(2)}>
                    <option>Number of Guests</option>
                    <option>10 - 50</option>
                    <option>50 - 100</option>
                    <option>100+</option>
                  </select>
                </div>

                <div className="flex-1 rounded-2xl p-6 border border-transparent hover:border-yellow-500/50 bg-transparent hover:bg-stone-800/50 transition-all flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg transition-colors ${bookingStep === 3 ? 'bg-yellow-500 text-black' : 'bg-stone-700 text-stone-400'}`}>3</div>
                    <span className="font-bold text-lg font-sans">Confirm</span>
                  </div>
                  <button onClick={() => { setBookingStep(3); onGetStarted(); }} className="w-full h-full bg-white text-black font-bold py-3 rounded-xl hover:bg-yellow-400 transition-colors text-lg shadow-lg hover:shadow-yellow-400/25 hover:-translate-y-0.5 active:translate-y-0 font-sans">
                    Check Availability
                  </button>
                </div>

              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* --- 6. TESTIMONIALS (DYNAMIC) --- */}
        <section className="py-24 px-4 sm:px-6 bg-[#FFFBEB] relative">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-800">Loved by Clients</h2>
                <p className="text-stone-500 mt-2">See what people are saying about our services</p>
              </div>
            </ScrollReveal>
            
            {/* Loading State */}
            {loadingReviews ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-yellow-600 w-8 h-8" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {reviews.length > 0 ? (
                  reviews.map((review, i) => (
                    <div key={i} className="bg-white p-8 rounded-4xl border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-300 relative group flex flex-col justify-between">
                      
                      <div className="mb-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex gap-1 text-yellow-500">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    // FIXED: Used className instead of 'fill' prop
                                    <Star key={star} className={`w-4 h-4 ${star <= review.rating ? "text-yellow-500 fill-yellow-400" : "text-stone-300"}`} />
                                ))}
                            </div>
                            {review.service_name && (
                                <span className="text-[10px] font-bold uppercase tracking-wide text-amber-700 bg-amber-50 px-2 py-1 rounded-md">
                                    {review.service_name}
                                </span>
                            )}
                        </div>
                        <Quote className="absolute top-6 left-6 text-yellow-100 w-12 h-12 group-hover:text-yellow-200 transition-colors" />
                        <p className="text-lg text-stone-600 font-serif leading-relaxed">"{review.comment}"</p>
                      </div>
                      
                      <div className="border-t border-stone-100 pt-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center font-bold text-amber-700 text-sm font-sans">
                                  {review.user_name?.charAt(0).toUpperCase() || "U"}
                                </div>
                                <div>
                                  <h4 className="font-bold text-stone-900 text-sm font-sans">{review.user_name || "Anonymous"}</h4>
                                  <span className="text-xs text-stone-400 font-sans">Verified Client</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <button onClick={onViewMenus} className="w-full py-2 bg-stone-50 hover:bg-stone-800 hover:text-white text-stone-800 text-xs font-bold uppercase tracking-wide rounded-lg transition-colors">
                                Book This Service
                            </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12 text-stone-400">
                    No reviews yet. Be the first to book a service!
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
        
      </div>
    </>
  );
};

export default LandingView;