import React, { useState, useMemo, useRef } from 'react';
import { 
  UtensilsCrossed, Check, X, 
  Users, Sparkles, ArrowRight, Heart, ChevronDown, ChevronUp
} from 'lucide-react';

// --- Types ---
interface Addon {
  id: string;
  name: string;
  description: string;
  price: number; 
}

interface Tier {
  name: string;
  displayName: string;
  color: string;
  textColor: string;      
  borderColor: string;    
  basePricePerHead: number;
  priceRangeDisplay: string;
  minGuests: number;
  maxGuests: number;
  description: string;
  inclusions: string[];
  equipment: string[];
  staffRatio: string;
  features: {
    bar: boolean;
    decor: boolean;
    liveCooking: boolean;
    coordinator: boolean;
  };
}

interface ServicesViewProps {
  onGetStarted: () => void;
}

// --- Data ---
const ADDONS: Addon[] = [
  { id: 'premium_bar', name: 'Premium Open Bar', description: 'Top-shelf spirits, craft cocktails, 5 hours', price: 150000 },
  { id: 'floral_decor', name: 'Floral Centerpieces', description: 'Premium arrangements for every table', price: 80000 },
  { id: 'live_station', name: 'Live Action Station', description: 'Sushi, Carving, or Pasta station', price: 60000 },
  { id: 'late_snack', name: 'Late Night Snack', description: 'Tacos or Donut wall for midnight', price: 40000 },
];

const SERVICE_TIERS: Tier[] = [
  {
    name: 'SILVER',
    displayName: 'Silver',
    color: 'bg-stone-100',
    textColor: 'text-stone-800',
    borderColor: 'border-stone-200',
    basePricePerHead: 4500,
    priceRangeDisplay: 'Rwf3500 - Rwf6500',
    minGuests: 20,
    maxGuests: 100,
    description: 'Essential catering for intimate gatherings with professional service.',
    inclusions: ['Standard Wait Staff', 'Buffet Setup', 'Basic Linens', 'Cleanup'],
    equipment: ['Standard Tables', 'Chairs', 'Chafing Dishes', 'Glassware'],
    staffRatio: '1:20',
    features: { bar: false, decor: false, liveCooking: false, coordinator: false }
  },
  {
    name: 'GOLD',
    displayName: 'Gold',
    color: 'bg-amber-50',
    textColor: 'text-amber-900',
    borderColor: 'border-amber-200',
    basePricePerHead: 8500,
    priceRangeDisplay: 'Rwf7500 - Rwf15000',
    minGuests: 50,
    maxGuests: 300,
    description: 'Premium catering experience with enhanced presentation.',
    inclusions: ['Premium Staff', 'Buffet & Plated', 'Designer Linens', 'House Wine/Beer'],
    equipment: ['Premium Tables', 'Chiavari Chairs', 'Silver Flatware', 'Portable Bar'],
    staffRatio: '1:15',
    features: { bar: true, decor: false, liveCooking: true, coordinator: true }
  },
  {
    name: 'DIAMOND',
    displayName: 'Diamond',
    color: 'bg-stone-50',
    textColor: 'text-stone-900',
    borderColor: 'border-stone-300',
    basePricePerHead: 15000,
    priceRangeDisplay: 'Rwf15000+',
    minGuests: 100,
    maxGuests: 1000,
    description: 'Luxury white-glove service and bespoke culinary experiences.',
    inclusions: ['White Glove Staff', 'Plated Service', 'Fine China', 'Executive Chef On-site'],
    equipment: ['Fine China', 'Crystal Glassware', 'Climate Tents', 'Lighting'],
    staffRatio: '1:10',
    features: { bar: true, decor: true, liveCooking: true, coordinator: true }
  }
];

// --- Preset Logic for Categories ---
const CATEGORY_PRESETS: Record<string, { bar: boolean; decor: boolean; live: boolean; coord: boolean }> = {
  'all': { bar: false, decor: false, live: false, coord: false },
  'wedding': { bar: true, decor: true, live: false, coord: true }, 
  'corporate': { bar: false, decor: false, live: true, coord: false }, 
  'social': { bar: true, decor: false, live: false, coord: false },
};

// --- Sub-Components ---

// 1. The Detailed Modal
const TierModal: React.FC<{ 
  tier: Tier; 
  guestCount: number; 
  onClose: () => void; 
  onStartCustomizing: () => void 
}> = ({ tier, guestCount, onClose, onStartCustomizing }) => {
  const estimatedTotal = tier.basePricePerHead * guestCount;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-stone-900/40 backdrop-blur-md p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-4xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-stone-100 my-4">
        {/* Header */}
        <div className={`p-8 rounded-t-4xl ${tier.color} relative overflow-hidden border-b border-white/50`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <span className="px-3 py-1 bg-white/60 text-stone-600 text-[10px] font-bold uppercase tracking-widest rounded-full">
                {tier.name} Package
              </span>
              <h2 className="font-serif text-4xl font-bold text-stone-900 mt-2">{tier.displayName}</h2>
              <p className="text-stone-600 mt-2 font-light italic">{tier.description}</p>
            </div>
            <button onClick={onClose} className="p-2 bg-white hover:bg-stone-50 rounded-full shadow-sm text-stone-400 hover:text-stone-800 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-10 space-y-10">
          {/* Pricing Summary */}
          <div className="bg-stone-900 text-amber-50 p-6 rounded-2xl flex justify-between items-center shadow-xl">
            <div>
              <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">Estimated for {guestCount} Guests</p>
              <p className="text-3xl font-serif font-black text-white mt-1">Rwf{estimatedTotal.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">Per Head</p>
              <p className="text-xl font-bold text-amber-400 mt-1">Rwf{tier.basePricePerHead}</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="font-serif text-lg font-bold mb-4 flex items-center gap-2 text-stone-900">
                <Heart className="w-4 h-4 text-amber-600 fill-amber-100" /> What's Included
              </h3>
              <ul className="space-y-3">
                {tier.inclusions.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-stone-600 font-light">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold mb-4 flex items-center gap-2 text-stone-900">
                <UtensilsCrossed className="w-4 h-4 text-stone-400" /> Equipment & Staff
              </h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {tier.equipment.map((item, i) => (
                  <span key={i} className="px-3 py-1 bg-stone-50 text-stone-600 border border-stone-200 rounded-md text-xs font-serif">
                    {item}
                  </span>
                ))}
              </div>
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-center justify-between">
                 <div>
                    <p className="text-xs font-bold text-amber-700 uppercase tracking-widest">Staff Ratio</p>
                    <p className="text-2xl font-serif font-black text-stone-900">{tier.staffRatio}</p>
                 </div>
                 <span className="text-xs text-stone-500 text-right max-w-25">One server per guest group.</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => { onStartCustomizing(); onClose(); }}
            className="w-full py-4 rounded-xl font-serif text-lg font-bold bg-stone-900 text-white hover:bg-stone-800 transition-all hover:shadow-lg flex justify-center items-center gap-2"
          >
            Customize This Plan <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// 2. The Quote Summary (Right side of builder)
const QuoteSummary: React.FC<{
  guestCount: number;
  selectedTier: Tier | undefined;
  selectedAddons: string[];
  onGetStarted: () => void;
}> = ({ guestCount, selectedTier, selectedAddons, onGetStarted }) => {
  
  const total = useMemo(() => {
    if (!selectedTier) return 0;
    const base = selectedTier.basePricePerHead * guestCount;
    const addonsTotal = selectedAddons.reduce((acc, id) => {
      const addon = ADDONS.find(a => a.id === id);
      return acc + (addon ? addon.price : 0);
    }, 0);
    return base + addonsTotal;
  }, [selectedTier, selectedAddons, guestCount]);

  if (!selectedTier) return null;

  return (
    <div className="lg:col-span-4">
      <div className="sticky top-24 bg-white text-stone-900 rounded-2xl p-0 shadow-xl border border-stone-200 overflow-hidden">
        <div className="bg-stone-900 text-amber-50 p-5 text-center border-b border-stone-800">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200">Live Estimate</p>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="space-y-3 border-b border-dashed border-stone-200 pb-6">
            <div className="flex justify-between text-sm">
              <span className="text-stone-500 font-light">{selectedTier.displayName} Package ({guestCount})</span>
              <span className="font-serif font-bold">Rwf{(selectedTier.basePricePerHead * guestCount).toLocaleString()}</span>
            </div>
            {selectedAddons.map(id => {
              const addon = ADDONS.find(a => a.id === id);
              return (
                <div key={id} className="flex justify-between text-sm">
                  <span className="text-stone-500 font-light pl-2 border-l-2 border-amber-200">{addon?.name}</span>
                  <span className="font-serif font-bold text-amber-700">+Rwf{addon?.price}</span>
                </div>
              );
            })}
            {selectedAddons.length === 0 && (
              <p className="text-xs text-stone-400 italic text-center py-2">No extra add-ons selected</p>
            )}
          </div>
          
          <div className="flex justify-between items-end">
            <span className="text-sm font-bold text-stone-400 uppercase tracking-wider">Total Est.</span>
            <span className="text-4xl font-serif font-black text-stone-900">Rwf{total.toLocaleString()}</span>
          </div>

          <button onClick={onGetStarted} className="w-full bg-amber-500 text-white py-4 rounded-xl font-serif font-bold hover:bg-amber-600 transition-colors flex justify-center items-center gap-2 shadow-lg shadow-amber-500/20 mt-2 group">
            Request Quote <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-center text-[10px] text-stone-400 leading-tight px-2">
            *Estimate excludes 10% service charge and VAT.
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

const ServicesView: React.FC<ServicesViewProps> = ({ onGetStarted }) => {
  // -- State --
  // REMOVED: const [selectedTier, setSelectedTier] = useState<Tier | null>(null); <--- THIS WAS THE ERROR
  const [modalTier, setModalTier] = useState<Tier | null>(null);
  
  // The "Customizer" State
  const [customizerBase, setCustomizerBase] = useState<string>('GOLD');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  
  // Filters
  const [guestCountInput, setGuestCountInput] = useState(100);
  const [filterCategory, setFilterCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Requirement flags
  const [reqBar, setReqBar] = useState(false);
  const [reqDecor, setReqDecor] = useState(false);
  const [reqLive, setReqLive] = useState(false);
  const [reqCoord, setReqCoord] = useState(false);

  // Ref for scrolling to builder
  const builderRef = useRef<HTMLDivElement>(null);

  // -- Logic --

  // Apply Preset when Category Changes
  const handleCategoryChange = (cat: string) => {
    setFilterCategory(cat);
    const preset = CATEGORY_PRESETS[cat] || CATEGORY_PRESETS['all'];
    setReqBar(preset.bar);
    setReqDecor(preset.decor);
    setReqLive(preset.live);
    setReqCoord(preset.coord);
  };

  // Filter Tiers based on requirements
  const filteredTiers = SERVICE_TIERS.filter(tier => {
    if (reqBar && !tier.features.bar) return false;
    if (reqDecor && !tier.features.decor) return false;
    if (reqLive && !tier.features.liveCooking) return false;
    if (reqCoord && !tier.features.coordinator) return false;
    return true;
  });

  // Helper to handle clicking a Tier Card
  const handleTierClick = (tier: Tier) => {
    setModalTier(tier);
  };

  // When user clicks "Customize" in modal
  const handleStartCustomizing = () => {
    setCustomizerBase(modalTier?.name || 'GOLD');
    // Scroll to builder
    setTimeout(() => {
      builderRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Get the actual Tier object for the customizer
  const activeCustomizerTier = SERVICE_TIERS.find(t => t.name === customizerBase);

  return (
    <div className="min-h-screen flex flex-col text-stone-800 bg-[#FFFBEB] font-sans selection:bg-amber-200 selection:text-stone-900">
      
      {/* --- Header --- */}
      <header className="bg-[#FFFBEB] pt-20 pb-16 px-6 border-b border-stone-200/60 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#44403c 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <span className="text-amber-700 font-bold tracking-widest uppercase text-xs mb-4 block">Catering Services</span>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-stone-900 mb-6 leading-tight">
            Design Your <br/> <span className="text-amber-600 italic">Perfect Event</span>
          </h1>
          <p className="text-stone-500 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Select your event type to filter packages, choose a tier, and customize your menu below.
          </p>
        </div>
      </header>

      {/* --- Smart Filter Toolbar --- */}
      <section className="sticky top-24 z-40 bg-[#FFFBEB]/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            
            {/* 1. Event Type Presets */}
            <div className="flex flex-wrap justify-center xl:justify-start gap-2">
              {['All', 'Wedding', 'Corporate', 'Social'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat.toLowerCase())}
                  className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all border ${
                    filterCategory === cat.toLowerCase() 
                      ? 'bg-stone-900 text-white border-stone-900 shadow-md' 
                      : 'bg-white text-stone-600 border-stone-200 hover:border-amber-300 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* 2. Quick Controls */}
            <div className="flex items-center gap-6 bg-white/80 px-5 py-3 rounded-full border border-stone-200 shadow-sm">
              {/* Guest Slider */}
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-stone-900 w-16">{guestCountInput} Guests</span>
                <input 
                  type="range" min="20" max="500" step="10"
                  value={guestCountInput}
                  onChange={(e) => setGuestCountInput(Number(e.target.value))}
                  className="w-32 h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
              </div>
              <div className="w-px h-4 bg-stone-300"></div>
              {/* Manual Filters Toggle */}
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-black transition-colors"
              >
                Preferences {showFilters ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
              </button>
            </div>
          </div>

          {/* Expanded Requirements Filter (Collapsible) */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-stone-200 grid grid-cols-1 md:grid-cols-12 gap-6 animate-in slide-in-from-top-2 duration-300">
              <div className="md:col-span-8">
                <h4 className="text-xs font-bold uppercase text-stone-400 mb-4 tracking-widest">Specific Requirements</h4>
                <div className="flex flex-wrap gap-3">
                  <FilterChip label="Full Bar Service" active={reqBar} onToggle={() => setReqBar(!reqBar)} />
                  <FilterChip label="Event Coordinator" active={reqCoord} onToggle={() => setReqCoord(!reqCoord)} />
                  <FilterChip label="Live Cooking Station" active={reqLive} onToggle={() => setReqLive(!reqLive)} />
                  <FilterChip label="Floral Decor" active={reqDecor} onToggle={() => setReqDecor(!reqDecor)} />
                </div>
              </div>
              <div className="md:col-span-4 flex items-center bg-amber-50 p-4 rounded-xl border border-amber-100">
                <Sparkles className="w-5 h-5 text-amber-500 mr-3 shrink-0" />
                <p className="text-sm text-amber-900 font-light leading-snug">
                  Showing {filteredTiers.length} package{filteredTiers.length !== 1 ? 's' : ''} suitable for <strong>{guestCountInput} guests</strong>.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* --- Tier Selection Cards --- */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {filteredTiers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {filteredTiers.map((tier) => {
                const total = tier.basePricePerHead * guestCountInput;
                const isGold = tier.name === 'GOLD';
                
                return (
                  <div 
                    key={tier.name}
                    onClick={() => handleTierClick(tier)}
                    className={`relative bg-white rounded-4xl border-2 p-8 transition-all duration-300 hover:-translate-y-2 group cursor-pointer overflow-hidden ${
                      isGold ? 'border-amber-300 shadow-xl shadow-amber-900/10 ring-4 ring-amber-100' : 'border-stone-100 shadow-sm hover:border-stone-300 hover:shadow-lg'
                    }`}
                  >
                    {isGold && (
                      <div className="absolute top-0 right-0 bg-amber-400 text-stone-900 text-[10px] font-bold px-4 py-2 rounded-bl-xl uppercase tracking-widest z-10">
                        Most Popular
                      </div>
                    )}

                    <div className="mb-6">
                      <h3 className={`font-serif text-3xl font-bold ${tier.textColor} mb-1`}>{tier.displayName}</h3>
                      <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest">{tier.minGuests} - {tier.maxGuests} Guests</p>
                    </div>
                    
                    <div className="mb-8 p-4 bg-stone-50 rounded-xl">
                      <span className="text-stone-500 text-[10px] font-bold uppercase tracking-wider block mb-1">Estimated Total</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-serif font-black text-stone-900">Rwf{total.toLocaleString()}</span>
                      </div>
                      <span className="text-xs text-stone-400 font-light">Rwf{tier.basePricePerHead} / person</span>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {tier.inclusions.slice(0, 3).map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-stone-600 font-light">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${isGold ? 'bg-amber-100 text-amber-600' : 'bg-stone-100 text-stone-400'}`}>
                            <Check className="w-2.5 h-2.5" />
                          </div>
                          {item}
                        </li>
                      ))}
                      <li className="text-xs text-stone-400 italic pl-7">+ {tier.inclusions.length - 3} more inclusions</li>
                    </ul>

                    <button className={`w-full py-3.5 rounded-xl font-serif font-bold text-sm transition-colors border-2 ${
                      isGold 
                        ? 'bg-amber-500 text-white border-amber-500 hover:bg-amber-600 shadow-md shadow-amber-500/20' 
                        : 'bg-white text-stone-900 border-stone-300 hover:bg-stone-900 hover:text-white'
                    }`}>
                      View Details
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-stone-200">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-6 h-6 text-stone-400" />
              </div>
              <h3 className="text-stone-900 font-serif text-2xl font-bold mb-2">No exact matches found</h3>
              <p className="text-stone-500 mb-6 max-w-md mx-auto">None of our standard packages meet all your specific requirements for {guestCountInput} guests.</p>
              <button 
                onClick={() => handleCategoryChange('all')}
                className="px-6 py-3 bg-stone-900 text-white rounded-full font-bold text-sm hover:bg-stone-800 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* --- Menu Builder & Customizer --- */}
      <section ref={builderRef} className="py-24 px-6 bg-white border-t border-stone-100 relative scroll-mt-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-stone-400 font-bold uppercase tracking-widest text-xs">Step 2</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-stone-900 mt-2">Build Your Custom Menu</h2>
            <p className="text-stone-500 mt-4 max-w-xl mx-auto">Select your base service level and add special touches to finalize your quote.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left: Builder Controls */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Step 1: Select Tier */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 sm:p-8">
                <h3 className="font-serif text-xl font-bold mb-6 text-stone-900">1. Choose Service Level</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {SERVICE_TIERS.map(t => (
                    <button
                      key={t.name}
                      onClick={() => setCustomizerBase(t.name)}
                      className={`p-5 rounded-xl border transition-all text-left group relative overflow-hidden ${
                        customizerBase === t.name 
                          ? 'bg-stone-900 text-white border-stone-900 shadow-lg' 
                          : 'bg-white border-stone-200 text-stone-600 hover:border-amber-300 hover:bg-white'
                      }`}
                    >
                      <div className="font-serif font-bold text-lg mb-1">{t.displayName}</div>
                      <div className="text-xs font-light opacity-80">Rwf{t.basePricePerHead}/head</div>
                      {customizerBase === t.name && (
                        <div className="absolute top-3 right-3">
                           <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-stone-900">
                             <Check className="w-3 h-3" />
                           </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Addons */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 sm:p-8">
                <h3 className="font-serif text-xl font-bold mb-6 text-stone-900">2. Add Special Touches</h3>
                <div className="space-y-3">
                  {ADDONS.map(addon => (
                    <label 
                      key={addon.id} 
                      className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedAddons.includes(addon.id)
                          ? 'bg-amber-50 border-amber-200 shadow-sm'
                          : 'bg-white border-stone-200 hover:border-stone-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${selectedAddons.includes(addon.id) ? 'bg-amber-200 text-amber-800' : 'bg-stone-100 text-stone-500'}`}>
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-stone-900 font-serif">{addon.name}</div>
                          <div className="text-xs text-stone-500 font-light mt-0.5">{addon.description}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-amber-700 font-bold font-serif">+Rwf{addon.price}</span>
                        <input type="checkbox" className="hidden" checked={selectedAddons.includes(addon.id)} onChange={() => toggleAddon(addon.id)} />
                      </div>
                    </label>
                  ))}
                </div>
              </div>

            </div>

            {/* Right: Quote Summary (Sticky) */}
            <QuoteSummary 
              guestCount={guestCountInput}
              selectedTier={activeCustomizerTier}
              selectedAddons={selectedAddons}
              onGetStarted={onGetStarted}
            />

          </div>
        </div>
      </section>

      {/* --- Modals --- */}
      {modalTier && (
        <TierModal 
          tier={modalTier} 
          guestCount={guestCountInput}
          onClose={() => setModalTier(null)} 
          onStartCustomizing={handleStartCustomizing}
        />
      )}

    </div>
  );
};

// Helper for filter chips to reduce repetition
const FilterChip: React.FC<{ label: string; active: boolean; onToggle: () => void }> = ({ label, active, onToggle }) => (
  <button 
    onClick={onToggle} 
    className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all flex items-center gap-2 ${
      active ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
    }`}
  >
    {active && <Check className="w-3 h-3" />}
    {label}
  </button>
);

export default ServicesView;