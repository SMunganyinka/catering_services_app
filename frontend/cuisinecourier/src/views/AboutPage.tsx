import React, { useEffect, useRef, useState } from 'react';
import { 
  Award, Leaf, ArrowRight, Quote, Users,
  Building2, Globe, Landmark, Plane
} from 'lucide-react';

// 1. Define Props Interface
// Added onStoryClick to handle the Hero button navigation
interface AboutPageProps {
  onPartnerClick?: () => void;
  onStoryClick?: () => void;
}

// 2. Helper Component for Scroll Animations
// Cleaned up syntax and removed "FIX" comments
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

// 3. Updated Component
const AboutPage: React.FC<AboutPageProps> = ({ onPartnerClick, onStoryClick }) => {
  
  // --- Partner Data ---
  const PARTNERS = [
    { name: "Marriott", icon: Building2 },
    { name: "RDB", icon: Globe },
    { name: "I&M Bank", icon: Landmark },
    { name: "RwandaAir", icon: Plane },
    { name: "UTB", icon: Globe },
    { name: "Radisson", icon: Building2 }
  ];

  // --- Other Data ---
  const values = [
    {
      title: 'Sustainability',
      desc: 'We prioritize eco-friendly sourcing and support local agriculture to minimize our footprint.',
      icon: <Leaf className="w-8 h-8" />,
      color: 'text-stone-800',
      bg: 'bg-stone-100',
    },
    {
      title: 'Certified Safety',
      desc: 'Holding ISO 22000 and HACCP certifications, we guarantee the highest standards of hygiene.',
      icon: <Award className="w-8 h-8" />,
      color: 'text-stone-800',
      bg: 'bg-stone-100',
    },
    {
      title: 'Community First',
      desc: 'We are a family. We treat every client and team member with the respect they deserve.',
      icon: <Users className="w-8 h-8" />,
      color: 'text-stone-800',
      bg: 'bg-stone-100',
    }
  ];

  const team = [
    { name: 'Chef Jean-Claude', role: 'Executive Chef', img: '/p2.webp' },
    { name: 'Sarah Mugabo', role: 'Operations Director', img: '/p1.webp' },
    { name: 'Davina Ndayisaba', role: 'Sommelier', img: '/p4.webp' },
    { name: 'Grace Uwimana', role: 'Head Pastry Chef', img: '/p5.webp' }
  ];

  const milestones = [
    { year: '2022', title: 'The Beginning', desc: 'Started as a small family kitchen in Kigali with a dream to serve authentic flavors.' },
    { year: '2023', title: 'First Major Contract', desc: 'Catered the National Business Summit, putting us on the map.' },
    { year: '2024', title: 'Expansion', desc: 'Opened our central commissary and won Best Caterer in Rwanda.' },
    { year: '2025', title: 'Zero Waste', desc: 'Achieved 100% zero-waste to landfill status, a milestone we are incredibly proud of.' },
  ];

  return (
    <div className="min-h-screen bg-[#FFFBEB] text-stone-800 font-sans selection:bg-amber-200 selection:text-stone-900">
      
    
      <section className="relative min-h-[85vh] flex items-center bg-[#FFFBEB] overflow-hidden">
       
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#44403c 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="container mx-auto px-6 sm:px-12 lg:px-20 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
       
          <div className="order-2 lg:order-1 space-y-8">
            <ScrollReveal>
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-stone-900 leading-[1.1] tracking-tight">
                Nurturing connections  <br/>
                <span className="italic text-yellow-500">through food.</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-stone-600 font-light leading-relaxed max-w-lg">
                Cuisine Courier isn't just a catering service; it's a tradition of excellence passed down through generations. We bring the warmth of a home-cooked meal to the grandest stages.
              </p>

              <div className="pt-4">
          
                <button 
                  onClick={onStoryClick}
                  className="group relative bg-stone-900 text-white px-8 py-4 rounded-full font-medium hover:bg-stone-800 transition-colors shadow-lg shadow-stone-900/10 flex items-center gap-3"
                >
                  Read Our Full Story
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </ScrollReveal>
          </div>

         
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end relative">
            <ScrollReveal delay={200} className="relative">
            
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-200/30 rounded-full blur-2xl -z-10"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-stone-200/50 rounded-full blur-2xl -z-10"></div>

              <div className="relative w-full max-w-md aspect-4/5 bg-white p-4 rounded-[2.5rem] shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700 ease-out border border-stone-100">
                <div className="w-full h-full rounded-4xl overflow-hidden">
                  <img src="/7.png" className="w-full h-full object-cover" alt="Chef preparing food"/>
                </div>
                
              
                <div className="absolute -bottom-6 -left-6 bg-amber-600 text-white px-6 py-3 rounded-2xl shadow-lg flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold font-serif">5+</span>
                  <span className="text-[10px] uppercase tracking-wider font-medium">Years of<br/>Excellence</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section id="our-story" className="py-24 bg-white relative border-y border-stone-100">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          
          <div className="md:col-span-5 space-y-12">
            <ScrollReveal>
              <div className="bg-stone-50 p-10 rounded-3xl border border-stone-100 relative">
                <Quote className="absolute -top-6 -left-6 w-12 h-12 text-amber-500 bg-white p-2 rounded-full shadow-sm" />
                <p className="font-serif text-2xl text-stone-700 italic leading-relaxed">
                  "Great food is the foundation of genuine happiness. We don't just serve; we care."
                </p>
                <div className="mt-6 flex items-center gap-4">
                   <div className="w-12 h-12 bg-stone-200 rounded-full overflow-hidden">
                     <img src="/p1.webp" alt="Founder" className="w-full h-full object-cover"/>
                   </div>
                   <div>
                     <p className="font-bold text-stone-900 text-sm">The Founder</p>
                     <p className="text-xs text-stone-500">Cuisine Courier</p>
                   </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-6">Trusted By Industry Leaders</p>
                <div className="grid grid-cols-3 gap-4">
                  {PARTNERS.map((partner, idx) => {
                    const Icon = partner.icon;
                    return (
                      <div key={idx} className="aspect-square bg-white border border-stone-100 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-amber-200 hover:bg-amber-50 transition-colors shadow-sm">
                        <Icon className="w-6 h-6 text-stone-400" />
                        <span className="text-[9px] font-bold text-stone-500 uppercase text-center leading-tight">
                          {partner.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </ScrollReveal>
          </div>

        
          <div className="md:col-span-7">
            <ScrollReveal delay={300}>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900 mb-8">
                From our family <br/> table to yours.
              </h2>
              <div className="space-y-6 text-stone-600 text-lg leading-relaxed">
                <p>
                  It started in 2022, not in a corporate boardroom, but around a crowded family table in Kigali. We noticed a gap in the market: catering that felt mechanical, cold, and devoid of soul. We decided to be the change we wished to see.
                </p>
                <p>
                  Today, Cuisine Courier is the heartbeat of Rwanda's most prestigious events. We blend logistical precision with artistic flair. Whether it's a wedding for two hundred or an intimate dinner for ten, we treat every dish as a canvas for storytelling.
                </p>
                <p>
                  We believe that food is the most powerful way to connect people. That’s why we source locally, cook passionately, and serve with pride.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

    
      <section className="py-24 bg-[#FFFBEB] relative overflow-hidden">
        
         <div className="absolute top-0 right-0 w-125 h-125 bg-amber-100/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-amber-700 font-bold tracking-widest uppercase text-xs">Our Philosophy</span>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900 mt-3">Rooted in Quality.</h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, idx) => (
              <div key={idx} className="bg-white p-10 rounded-4xl border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
                <div className={`w-16 h-16 rounded-2xl ${value.bg} ${value.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300`}>
                  {value.icon}
                </div>
                <h3 className="font-serif text-2xl font-bold text-stone-900 mb-4">{value.title}</h3>
                <p className="text-stone-600 leading-relaxed font-light">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

     
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <ScrollReveal>
              <div>
                <span className="text-amber-600 font-bold tracking-widest uppercase text-xs block mb-2">Our History</span>
                <h2 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900">The Journey So Far</h2>
              </div>
            </ScrollReveal>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((milestone, idx) => (
              <div key={idx} className="group relative bg-stone-50 p-8 rounded-3xl border border-stone-100 hover:bg-stone-900 hover:text-white transition-all duration-500 cursor-default overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity">
                    <span className="text-8xl font-black">{milestone.year}</span>
                </div>
                
                <div className="relative z-10">
                  <span className="inline-block px-3 py-1 bg-white border border-stone-200 text-stone-900 text-[10px] font-bold rounded-full mb-6 group-hover:bg-stone-800 group-hover:border-stone-700 group-hover:text-white transition-colors">
                    {milestone.year}
                  </span>
                  <h3 className="font-serif text-xl font-bold mb-3 group-hover:text-white transition-colors">{milestone.title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed group-hover:text-stone-300 transition-colors">
                    {milestone.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

     
      <section className="py-24 bg-stone-900 text-stone-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <ScrollReveal>
              <div>
                <span className="text-amber-500 font-bold tracking-widest uppercase text-xs block mb-2">The Team</span>
                <h2 className="font-serif text-4xl sm:text-6xl font-bold text-white tracking-tight">Meet the<br/>Experts</h2>
              </div>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, idx) => (
              <div key={idx} className="group relative aspect-3/4 rounded-4xl overflow-hidden bg-stone-800">
                {/* Image */}
                <img src={member.img} className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-500" alt={member.name} />
                
                
                <div className="absolute inset-0 bg-linear-to-t from-stone-900 via-transparent to-transparent opacity-90"></div>
                
                <div className="absolute bottom-0 left-0 w-full p-8">
                  <div className="w-8 h-1 bg-amber-500 mb-4  group-hover:w-12 transition-all duration-300"></div>
                  <h4 className="font-serif text-2xl font-bold text-white mb-1">{member.name}</h4>
                  <p className="text-amber-500 text-xs font-bold uppercase tracking-widest">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    
      <section className="py-32 px-6 bg-[#FFFBEB] relative overflow-hidden text-center">
        <div className="max-w-3xl mx-auto relative z-10 space-y-8">
          <ScrollReveal>
            <span className="inline-block px-4 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full mb-6">Giving Back</span>
            <h2 className="font-serif text-4xl sm:text-6xl font-bold text-stone-900 leading-tight">
              We believe in giving <br/> <span className="text-amber-700 italic">more than we take.</span>
            </h2>
            <p className="text-lg text-stone-600 max-w-xl mx-auto font-light leading-relaxed">
              From youth scholarships to local food banks, 5% of our profits go directly back into the community that raised us. When you dine with us, you help build a better Rwanda.
            </p>
            
            <div className="pt-8">
              <button 
                onClick={onPartnerClick} 
                className="bg-stone-900 text-white px-10 py-4 rounded-full text-base font-bold hover:bg-stone-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2 mx-auto"
              >
                Partner With Us <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </ScrollReveal>
        </div>
        
 
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-linear-to-t from-white to-transparent pointer-events-none"></div>
      </section>

    </div>
  );
};

export default AboutPage;