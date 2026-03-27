import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Filter, Grid, List, Star, Calendar, MapPin, Users, 
  Download, ChevronDown, X, UserCircle, BadgeCheck, Quote as LucideQuote
} from 'lucide-react';

interface GalleryPageProps {
  onBack?: () => void;
}

const GalleryPage: React.FC<GalleryPageProps> = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  
  // --- Filter States ---
  const [searchQuery, setSearchQuery] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [teamLeadFilter, setTeamLeadFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [sortBy] = useState('date');

  // --- FIX: Lock body scroll when modal is open ---
  useEffect(() => {
    if (selectedEvent) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedEvent]);

  // --- Mock Data ---
  const portfolioItems = [
    {
      id: '1',
      title: 'Royal Wedding Celebration',
      eventType: 'Wedding',
      tier: 'DIAMOND',
      date: '2024-12-15',
      location: 'Kigali Convention Center',
      guestCount: 350,
      images: ['/1.png', '/2.png', '/3.png'],
      teamLead: 'Chef Jean',
      clientName: 'Mr. & Mrs. Nzeyimana',
      rating: 5,
      testimonial: 'Absolutely magical! Every detail was perfect.',
      teamLeadImg: 'https://i.pravatar.cc/150?u=jean'
    },
    {
      id: '2',
      title: 'Tech Company Gala',
      eventType: 'Corporate',
      tier: 'GOLD',
      date: '2024-11-20',
      location: 'Kigali Marriott Hotel',
      guestCount: 200,
      images: ['/4.png', '/5.png'],
      teamLead: 'Chef Marie',
      clientName: 'Tech Rwanda Ltd',
      rating: 5,
      testimonial: 'Professional service that exceeded expectations.',
      teamLeadImg: 'https://i.pravatar.cc/150?u=marie'
    },
    {
      id: '3',
      title: 'Sweet 16 Birthday',
      eventType: 'Birthday',
      tier: 'SILVER',
      date: '2024-10-05',
      location: 'Villa des Roses',
      guestCount: 50,
      images: ['/6.png', '/7.png'],
      teamLead: 'Chef Pierre',
      clientName: 'Miss Diane',
      rating: 5,
      testimonial: 'Best party ever! The cake was amazing!',
      teamLeadImg: 'https://i.pravatar.cc/150?u=pierre'
    },
    {
      id: '4',
      title: 'Charity Fundraiser',
      eventType: 'Social',
      tier: 'GOLD',
      date: '2024-09-12',
      location: 'Kigali Heights',
      guestCount: 150,
      images: ['/1.png', '/2.png'],
      teamLead: 'Chef Jean',
      clientName: 'Hope Foundation',
      rating: 5,
      testimonial: 'Elegant and impactful. Thank you!',
      teamLeadImg: 'https://i.pravatar.cc/150?u=jean'
    },
    {
      id: '5',
      title: 'Executive Retreat',
      eventType: 'Corporate',
      tier: 'DIAMOND',
      date: '2024-08-25',
      location: 'Lake Kivu Resort',
      guestCount: 80,
      images: ['/3.png', '/4.png'],
      teamLead: 'Chef Marie',
      clientName: 'Pan African Corp',
      rating: 5,
      testimonial: 'World-class service in Rwanda.',
      teamLeadImg: 'https://i.pravatar.cc/150?u=marie'
    },
    {
      id: '6',
      title: 'Anniversary Dinner',
      eventType: 'Social',
      tier: 'SILVER',
      date: '2024-07-14',
      location: 'The Pheasantry',
      guestCount: 25,
      images: ['/5.png', '/6.png'],
      teamLead: 'Chef Pierre',
      clientName: 'Mr. & Mrs. Mukasine',
      rating: 5,
      testimonial: 'Romantic and intimate. Perfect evening.',
      teamLeadImg: 'https://i.pravatar.cc/150?u=pierre'
    }
  ];

  // --- Dynamic Options for Team Leads ---
  const uniqueTeamLeads = useMemo(() => {
    const leads = [...new Set(portfolioItems.map(item => item.teamLead))];
    return leads.sort();
  }, []);

  // --- Advanced Filtering & Sorting Logic ---
  const filteredItems = useMemo(() => {
    let result = [...portfolioItems];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.clientName.toLowerCase().includes(query)
      );
    }

    if (eventTypeFilter !== 'all') {
      result = result.filter(item => item.eventType === eventTypeFilter);
    }

    if (tierFilter !== 'all') {
      result = result.filter(item => item.tier === tierFilter);
    }

    if (teamLeadFilter !== 'all') {
      result = result.filter(item => item.teamLead === teamLeadFilter);
    }

    if (locationFilter) {
      result = result.filter(item => 
        item.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (dateRange.start) {
      result = result.filter(item => item.date >= dateRange.start);
    }
    if (dateRange.end) {
      result = result.filter(item => item.date <= dateRange.end);
    }

    switch (sortBy) {
      case 'date':
        result.sort((a, b) => b.date.localeCompare(a.date));
        break;
      case 'popularity':
        result.sort((a, b) => b.guestCount - a.guestCount);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [searchQuery, eventTypeFilter, tierFilter, teamLeadFilter, locationFilter, dateRange, sortBy]);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'DIAMOND': return 'bg-indigo-100/90 text-indigo-900 border border-indigo-200 backdrop-blur-sm';
      case 'GOLD': return 'bg-amber-100/90 text-amber-900 border border-amber-200 backdrop-blur-sm';
      case 'SILVER': return 'bg-stone-200/90 text-stone-800 border border-stone-300 backdrop-blur-sm';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getTierColorSolid = (tier: string) => {
    switch (tier) {
      case 'DIAMOND': return 'bg-indigo-600 shadow-indigo-500/30';
      case 'GOLD': return 'bg-amber-500 shadow-amber-500/30';
      case 'SILVER': return 'bg-stone-500 shadow-stone-500/30';
      default: return 'bg-gray-500';
    }
  };


  return (
    <div className="min-h-screen text-stone-800 font-sans pb-20 selection:bg-amber-100 selection:text-amber-900">
      
      {/* Header - Responsive Typography */}
      <header className="relative pt-16 pb-16 px-4 sm:px-6 border-b border-stone-200/60 overflow-hidden bg-white">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#44403c 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-stone-900 mb-4 sm:mb-6 leading-tight tracking-tight">
            Moments We've <br/> <span className="text-yellow-500 italic">Captured</span>
          </h1>
          <p className="text-stone-500 max-w-2xl mx-auto text-base sm:text-lg font-light leading-relaxed px-4">
            Explore our curated collection of events. From intimate gatherings to grand galas, find inspiration in the stories we've helped tell.
          </p>
        </div>
      </header>

      {/* Advanced Search & Filter Bar */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            
            {/* Search Bar */}
            <div className="relative grow group w-full md:w-auto">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-stone-400 group-focus-within:text-amber-600 transition-colors" />
              <input 
                type="text"
                placeholder="Search events, clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400 focus:bg-white transition-all text-sm sm:text-base font-medium placeholder-stone-400"
              />
            </div>

            {/* Toggle Buttons */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex-1 md:flex-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-sm border ${
                  showFilters ? 'bg-stone-900 text-white border-stone-900 shadow-md' : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50 hover:border-stone-300'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
              </button>

              <div className="flex bg-white border border-stone-200 rounded-xl p-1">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 sm:p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-amber-100 text-amber-700' : 'text-stone-400 hover:bg-stone-50'}`}
                >
                  <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 sm:p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-amber-100 text-amber-700' : 'text-stone-400 hover:bg-stone-50'}`}
                >
                  <List className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Expanded Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-stone-200 animate-in slide-in-from-top-2 duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div>
                  <label className="block text-[10px] font-bold uppercase text-stone-400 mb-2 tracking-wider">Event Type</label>
                  <select 
                    value={eventTypeFilter}
                    onChange={(e) => setEventTypeFilter(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-200 outline-none text-stone-700 font-medium appearance-none"
                  >
                    <option value="all">All Types</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Social">Social</option>
                    <option value="Birthday">Birthday</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-stone-400 mb-2 tracking-wider">Service Tier</label>
                  <select 
                    value={tierFilter}
                    onChange={(e) => setTierFilter(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-200 outline-none text-stone-700 font-medium appearance-none"
                  >
                    <option value="all">All Tiers</option>
                    <option value="SILVER">Silver</option>
                    <option value="GOLD">Gold</option>
                    <option value="DIAMOND">Diamond</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-stone-400 mb-2 tracking-wider">Team Lead</label>
                  <div className="relative">
                    <select 
                      value={teamLeadFilter}
                      onChange={(e) => setTeamLeadFilter(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-200 outline-none text-stone-700 font-medium appearance-none"
                    >
                      <option value="all">All Leads</option>
                      {uniqueTeamLeads.map(lead => (
                        <option key={lead} value={lead}>{lead}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-stone-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-stone-400 mb-2 tracking-wider">Date Range</label>
                  <div className="flex gap-2">
                     <input 
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                      className="w-full px-2 sm:px-3 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-mono text-stone-600 focus:ring-2 focus:ring-amber-200 outline-none"
                    />
                    <input 
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                      className="w-full px-2 sm:px-3 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-mono text-stone-600 focus:ring-2 focus:ring-amber-200 outline-none"
                    />
                  </div>
                </div>

                <div className="col-span-1 sm:col-span-2 lg:col-span-4 flex justify-center sm:justify-start mt-2">
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setEventTypeFilter('all');
                      setTierFilter('all');
                      setTeamLeadFilter('all');
                      setLocationFilter('');
                      setDateRange({ start: '', end: '' });
                    }}
                    className="px-6 py-2.5 text-sm font-bold text-stone-500 hover:text-stone-900 border border-dashed border-stone-300 hover:border-stone-900 rounded-xl transition-all"
                  >
                    Reset All Filters
                  </button>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p className="text-stone-500 text-sm font-medium">
          Showing <span className="font-bold text-stone-900">{filteredItems.length}</span> event{filteredItems.length !== 1 && 's'}
        </p>
        <div className="text-xs sm:text-sm text-stone-400">
           Sorted by: <span className="text-stone-800 font-medium capitalize">{sortBy === 'date' ? 'Most Recent' : sortBy}</span>
        </div>
      </div>

      {/* Gallery Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((item) => (
              <div 
                key={item.id}
                className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer border border-stone-100 flex flex-col"
                onClick={() => setSelectedEvent(item)}
              >
                {/* Image Area */}
                <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                  <img 
                    src={item.images[0]} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                  
                  {/* Tier Badge */}
                  <div className={`absolute top-3 left-3 sm:top-4 sm:left-4 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md ${getTierColor(item.tier)}`}>
                    {item.tier}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 flex flex-col grow">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-amber-600">{item.eventType}</span>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      <Star size={12} fill="currentColor" />
                      <span className="text-xs font-bold text-stone-700 ml-1">{item.rating}.0</span>
                    </div>
                  </div>
                  
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 mb-2 leading-snug group-hover:text-amber-700 transition-colors line-clamp-2">{item.title}</h3>
                  
                  <div className="mt-auto pt-3 sm:pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-medium">
                    <span className="flex items-center gap-1.5"><Calendar size={14} className="text-stone-400"/> {new Date(item.date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1.5"><Users size={14} className="text-stone-400"/> {item.guestCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {filteredItems.map((item) => (
              <div 
                key={item.id}
                className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col sm:flex-row border border-stone-100 group"
                onClick={() => setSelectedEvent(item)}
              >
                <div className="w-full sm:w-80 h-56 sm:h-auto relative shrink-0">
                  <img 
                    src={item.images[0]} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className={`absolute top-3 left-3 sm:top-4 sm:left-4 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase text-white shadow-md ${getTierColorSolid(item.tier)}`}>
                    {item.tier}
                  </div>
                </div>
                <div className="p-5 sm:p-8 flex flex-col justify-center grow">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-1 sm:mb-2 block">{item.eventType}</span>
                      <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-stone-900 leading-tight group-hover:text-amber-700 transition-colors">{item.title}</h3>
                    </div>
                    <div className="hidden sm:flex flex-col items-center bg-stone-50 px-4 py-2 rounded-xl">
                       <span className="text-[10px] text-stone-400 font-bold uppercase">Rating</span>
                       <div className="flex items-center gap-1 text-amber-500">
                          <Star size={14} fill="currentColor" />
                          <span className="font-bold text-stone-900">{item.rating}</span>
                       </div>
                    </div>
                  </div>
                  
                  <p className="text-stone-500 font-light italic text-sm mb-4 sm:mb-6 line-clamp-2">"{item.testimonial}"</p>

                  <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-stone-600">
                    <span className="flex items-center gap-2 font-medium bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-lg">
                      <MapPin size={14} className="text-stone-400"/> {item.location}
                    </span>
                    <span className="flex items-center gap-2 font-medium bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-lg">
                      <Calendar size={14} className="text-stone-400"/> {item.date}
                    </span>
                    <span className="flex items-center gap-2 font-medium bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-lg">
                      <UserCircle size={14} className="text-stone-400"/> {item.teamLead}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredItems.length === 0 && (
          <div className="text-center py-16 sm:py-24 bg-white rounded-2xl sm:rounded-[2.5rem] border-2 border-dashed border-stone-200 mx-2 sm:mx-0">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-stone-100 rounded-full mb-4 sm:mb-6">
              <Search className="w-6 h-6 text-stone-400" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mb-2">No events found</h3>
            <p className="text-stone-500 mb-6 sm:mb-8 max-w-sm mx-auto px-4 text-sm">We couldn't find any events matching your criteria. Try adjusting your filters.</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setEventTypeFilter('all');
                setTierFilter('all');
                setTeamLeadFilter('all');
                setLocationFilter('');
                setDateRange({ start: '', end: '' });
              }}
              className="bg-stone-900 text-white px-6 sm:px-8 py-3 rounded-full font-bold hover:bg-stone-800 transition-colors shadow-lg shadow-stone-900/10 text-sm"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>

      {/* Event Detail Modal - FULLY RESPONSIVE */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-sm animate-in fade-in duration-200 flex items-center justify-center p-0 sm:p-4">
          
          {/* Mobile: Fullscreen / Desktop: Card */}
          <div className="bg-white w-full h-full sm:h-auto sm:max-w-5xl sm:max-h-[90vh] sm:rounded-[2.5rem] shadow-2xl flex flex-col relative overflow-hidden">
            
            {/* Close Button - Safe Areas */}
            <button 
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 z-20 p-2 bg-white/90 hover:bg-white text-stone-900 rounded-full transition-colors backdrop-blur shadow-sm border border-stone-100 sm:top-6 sm:right-6"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Hero Image */}
            <div className="relative h-56 sm:h-72 md:h-80 lg:h-96 shrink-0">
              <img 
                src={selectedEvent.images[0]} 
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-stone-900/90 via-stone-900/20 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-5 sm:p-8 lg:p-12">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <span className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase text-white shadow-lg backdrop-blur-md ${getTierColorSolid(selectedEvent.tier)}`}>
                    {selectedEvent.tier} Tier
                  </span>
                  <span className="text-white/90 text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-black/30 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full backdrop-blur-md border border-white/10">
                    {selectedEvent.eventType}
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-3xl">{selectedEvent.title}</h2>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-12 bg-stone-50 custom-scrollbar">
              
              {/* Stats Grid - Compact on Mobile */}
              <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-6 sm:mb-8 lg:mb-10">
                <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-stone-100 shadow-sm flex flex-col items-center justify-center text-center">
                  <Calendar className="w-4 h-4 sm:w-6 sm:h-6 mb-1 sm:mb-2 text-amber-500" />
                  <p className="text-[9px] sm:text-[10px] font-bold text-stone-400 uppercase tracking-wider">Date</p>
                  <p className="font-bold text-stone-900 mt-0.5 sm:mt-1 text-[10px] sm:text-sm">{selectedEvent.date}</p>
                </div>
                <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-stone-100 shadow-sm flex flex-col items-center justify-center text-center">
                  <Users className="w-4 h-4 sm:w-6 sm:h-6 mb-1 sm:mb-2 text-blue-500" />
                  <p className="text-[9px] sm:text-[10px] font-bold text-stone-400 uppercase tracking-wider">Guests</p>
                  <p className="font-bold text-stone-900 mt-0.5 sm:mt-1 text-[10px] sm:text-sm">{selectedEvent.guestCount}</p>
                </div>
                <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-stone-100 shadow-sm flex flex-col items-center justify-center text-center">
                  <MapPin className="w-4 h-4 sm:w-6 sm:h-6 mb-1 sm:mb-2 text-red-500" />
                  <p className="text-[9px] sm:text-[10px] font-bold text-stone-400 uppercase tracking-wider">Location</p>
                  <p className="font-bold text-stone-900 mt-0.5 sm:mt-1 text-[10px] sm:text-sm leading-tight line-clamp-1">{selectedEvent.location}</p>
                </div>
                <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-stone-100 shadow-sm flex flex-col items-center justify-center text-center">
                  <Star className="w-4 h-4 sm:w-6 sm:h-6 mb-1 sm:mb-2 text-yellow-500" />
                  <p className="text-[9px] sm:text-[10px] font-bold text-stone-400 uppercase tracking-wider">Rating</p>
                  <p className="font-bold text-stone-900 mt-0.5 sm:mt-1 text-[10px] sm:text-sm">{selectedEvent.rating}/5</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
                {/* Left: Details & Content */}
                <div className="md:col-span-2 space-y-6 md:space-y-8">
                  
                  {/* Team Lead Card */}
                  <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-stone-100 flex items-center gap-3 sm:gap-4 shadow-sm">
                    <img src={selectedEvent.teamLeadImg} alt={selectedEvent.teamLead} className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white shadow-md object-cover bg-stone-100 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <BadgeCheck size={10} className="text-amber-500" /> Team Lead
                      </p>
                      <p className="text-base sm:text-lg font-bold text-stone-900">{selectedEvent.teamLead}</p>
                    </div>
                  </div>

                  {/* Testimonial */}
                  {selectedEvent.testimonial && (
                    <div className="bg-amber-50 p-5 sm:p-8 rounded-xl sm:rounded-2xl border border-amber-100 relative">
                      <LucideQuote className="w-5 h-5 sm:w-8 sm:h-8 text-amber-300 mb-2" />
                      <p className="text-stone-700 italic text-sm sm:text-lg leading-relaxed font-serif">"{selectedEvent.testimonial}"</p>
                      <p className="text-xs sm:text-sm text-stone-500 mt-4 sm:mt-6 font-bold flex items-center gap-3">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center text-xs shadow-sm border border-stone-100 shrink-0">
                          {selectedEvent.clientName.charAt(0)}
                        </span>
                        {selectedEvent.clientName}
                      </p>
                    </div>
                  )}

                  {/* Horizontal Gallery */}
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-stone-900 mb-4">Gallery</h3>
                    <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide">
                      {selectedEvent.images.map((img: string, i: number) => (
                        <img 
                          key={i}
                          src={img}
                          alt={`Gallery ${i + 1}`}
                          className="w-32 h-32 sm:w-48 sm:h-48 object-cover rounded-xl sm:rounded-2xl shrink-0 snap-center shadow-md hover:shadow-xl transition-all cursor-pointer border border-stone-100"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Sticky Actions */}
                <div className="md:col-span-1">
                  <div className="md:sticky md:top-6 space-y-4">
                    <div className="bg-white border border-stone-200 p-5 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl">
                      <h3 className="font-bold text-stone-900 mb-4 sm:mb-6 font-serif text-lg">Interested?</h3>
                      
                      <button className="w-full py-3 border-2 border-stone-200 text-stone-700 rounded-xl font-bold hover:border-stone-900 hover:text-stone-900 transition-all flex items-center justify-center gap-2 mb-3 text-xs sm:text-sm uppercase tracking-wide">
                        <Download className="w-4 h-4" /> Brochure
                      </button>
                      
                      <button className="w-full py-3 sm:py-3.5 bg-amber-500 text-stone-900 rounded-xl font-bold hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20 text-xs sm:text-sm uppercase tracking-wide">
                        Book Similar Event
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default GalleryPage;