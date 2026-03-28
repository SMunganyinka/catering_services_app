import React, { useState, useEffect } from 'react';
import { 
  Calendar, MapPin, Users, ChevronRight, 
  CheckCircle, Search, X, UtensilsCrossed, 
  Clock, CreditCard, Home, LogOut, ShoppingBag, Bell, Menu, X as XIcon, AlertCircle, Star, Settings
} from 'lucide-react';
import type { User } from '../types';
// --- IMPORT STAR RATING ---
import StarRating from '../Components/StarRating';
// --- IMPORT PROFILE SETTINGS ---
import ProfileSettings from '../Components/ProfileSettings'; 
// --- IMPORT API HELPERS ---
import { apiGet, apiPost, API_BASE_URL } from '../api';


// --- Types ---
interface Service {
  id: number;
  name: string;
  description: string;
  price_per_person: number;
  image_url?: string;
  provider_id: number;
}

interface Booking {
  id: number;
  user_id: number;
  service_id: number;
  event_date: string;
  guests: number;
  payment_method: string;
  transaction_id: string;
  status: string;
  location?: string;
  notes?: string;
  service?: Service;
}

interface ClientDashboardProps {
  user: User;
  onLogout: () => void;
  onNavigateHome?: () => void;
}

// --- Toast Component ---
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error', onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-20 right-4 z-100 animate-in slide-in-from-right-5 duration-300">
      <div className={`bg-white border-l-4 shadow-2xl rounded-xl p-4 pr-10 flex items-center gap-3 min-w-75 ${
        type === 'success' ? 'border-green-500' : 'border-red-500'
      }`}>
        <div className={`p-2 rounded-full ${type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
        </div>
        <div>
          <p className="font-bold text-sm text-gray-900">{type === 'success' ? 'Success' : 'Error'}</p>
          <p className="text-xs text-gray-500">{message}</p>
        </div>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

const ClientDashboard: React.FC<ClientDashboardProps> = ({ user, onLogout, onNavigateHome }) => {
  const [activeView, setActiveView] = useState<'browse' | 'bookings' | 'profile'>('browse');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [reviewingBooking, setReviewingBooking] = useState<Booking | null>(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  
  const [viewingService, setViewingService] = useState<Service | null>(null);
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState({
    date: '',
    guests: '',
    location: '',
    notes: '',
    payment_method: 'stripe'
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // --- CHECK STRIPE REDIRECT ON LOAD ---
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
      showToast("Payment Successful! Awaiting confirmation.", "success");
      fetchData();
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // --- FETCH DATA FROM BACKEND ---
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Fetch Services
    try {
      const data = await apiGet('/services/');
      setServices(data);
    } catch (e) {
      console.error("Failed to fetch services", e);
    }

    // Fetch Bookings
    try {
      const data = await apiGet('/bookings/');
      setBookings(data);
    } catch (e) {
      console.error("Failed to fetch bookings", e);
    }
  };

  // --- FETCH REVIEWS FUNCTION ---
  const fetchReviewsForService = async (serviceId: number) => {
    try {
      const data = await apiGet(`/services/${serviceId}/reviews`);
      setReviewsList(data);
      setViewingService(services.find(s => s.id === serviceId) || null);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    }
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getServiceForBooking = (serviceId: number) => {
    return services.find(s => s.id === serviceId);
  };

  const getCountdown = (dateString: string) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    const diff = eventDate.getTime() - now.getTime();
    if (diff <= 0) return null;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return { days, hours };
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const initiateStripePayment = async (amount: number, serviceName: string) => {
    try {
      const data = await apiPost('/create-checkout-session', {
        amount: amount,
        service_name: serviceName,
        success_url: `${window.location.origin}/dashboard?payment=success`,
        cancel_url: `${window.location.origin}/dashboard?payment=cancelled`
      });

      if (data.url) {
        window.location.href = data.url;
      } else {
        showToast("Failed to initialize payment", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Payment connection error", "error");
    }
  };

  const openBookingModal = (service: Service) => {
    setSelectedService(service);
    setFormData({ date: '', guests: '', location: '', notes: '', payment_method: 'stripe' });
  };

  const closeBookingModal = () => {
    setSelectedService(null);
    setIsProcessing(false);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;
    
    setIsProcessing(true);
    const guestCount = parseInt(formData.guests);
    const totalAmount = selectedService.price_per_person * guestCount;

    try {
       await apiPost('/bookings/', {
        service_id: selectedService.id,
        event_date: formData.date,
        guests: guestCount,
        payment_method: formData.payment_method,
        transaction_id: 'PENDING',
        location: formData.location,
        notes: formData.notes
      });
      
      if (formData.payment_method === 'stripe') {
        await initiateStripePayment(totalAmount, selectedService.name);
      } else {
        closeBookingModal();
        setActiveView('bookings');
        fetchData(); 
        showToast("Booking request sent successfully!", "success");
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to connect to server", "error");
      setIsProcessing(false);
    }
  };

  const handlePayInvoice = (booking: Booking) => {
    const service = getServiceForBooking(booking.service_id);
    if (!service) return;
    
    const totalCost = service.price_per_person * booking.guests;

    if (booking.payment_method === 'stripe') {
      initiateStripePayment(totalCost, service.name);
    } else if (booking.payment_method === 'momo') {
      alert(`PAYMENT DETAILS (Booking #${booking.id})\n\nTotal: RWF ${totalCost.toLocaleString()}\n\nMTN Mobile Money Number:\n0781616450\n\nAccount Name: Cuisine Courier\nReference: #${booking.id}`);
    } else if (booking.payment_method === 'bank') {
      alert(`PAYMENT DETAILS (Booking #${booking.id})\n\nTotal: RWF ${totalCost.toLocaleString()}\n\nBank: BK Kigali\nAccount Name: Cuisine Courier\nAccount No: 000-123456-789\nReference: #${booking.id}`);
    } else {
      alert("Unknown payment method selected.");
    }
  };

  const openReviewModal = (booking: Booking) => {
    setReviewingBooking(booking);
    setReviewForm({ rating: 5, comment: '' });
  };

  const closeReviewModal = () => setReviewingBooking(null);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingBooking) return;

    try {
      await apiPost('/reviews/', {
        booking_id: reviewingBooking.id,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });

      showToast("Review submitted successfully!", "success");
      setReviewingBooking(null);
      fetchData(); 
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to connect to server", "error");
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingBookings = bookings.filter(b => new Date(b.event_date) >= today);
  const historyBookings = bookings.filter(b => new Date(b.event_date) < today);

  const getImageUrl = (url: string | undefined): string => {
    if (!url) return `https://picsum.photos/seed/default/400/300`;
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}/${url}`; 
  };

  return (
    <div className="flex h-screen bg-[#FFFBEB] text-stone-800 font-sans overflow-hidden relative">
      
      {/* --- MOBILE HEADER --- */}
      <div className="md:hidden fixed top-0 left-0 right-0 flex items-center justify-between px-4 py-3 bg-white border-b border-stone-200 z-50 h-16 shrink-0">
        <div className="flex items-center gap-2.5"> 
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <UtensilsCrossed size={18} />
            </div>
            <div className="flex flex-col justify-center">
                <span className="font-bold text-sm leading-none text-stone-900 tracking-tight">CuisineCourier</span>
            </div>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-xl hover:bg-stone-100 text-stone-900">
          <Menu size={24} />
        </button>
      </div>

      {/* --- MOBILE SIDEBAR DRAWER --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-60 bg-stone-900/40 backdrop-blur-sm md:hidden animate-in fade-in duration-200">
          <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 overflow-y-auto p-6 flex flex-col">
            <div className="flex justify-between items-center mb-8">
               <span className="font-serif text-lg font-bold">Menu</span>
               <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-stone-100 rounded-full"><XIcon size={20} /></button>
            </div>
            <div className="space-y-2 flex-1">
              <MobileMenuItem icon={ShoppingBag} label="Browse Services" active={activeView === 'browse'} onClick={() => { setActiveView('browse'); setIsMobileMenuOpen(false); }} />
              <MobileMenuItem icon={Calendar} label="My Bookings" active={activeView === 'bookings'} onClick={() => { setActiveView('bookings'); setIsMobileMenuOpen(false); }} badge={upcomingBookings.length} />
              <MobileMenuItem icon={Settings} label="Settings" active={activeView === 'profile'} onClick={() => { setActiveView('profile'); setIsMobileMenuOpen(false); }} />
            </div>
            <div className="border-t border-stone-100 pt-6 mt-4 space-y-2">
               <MobileMenuItem icon={Home} label="Back to Home" onClick={() => { onNavigateHome && onNavigateHome(); setIsMobileMenuOpen(false); }} />
               <MobileMenuItem icon={LogOut} label="Logout" onClick={() => { onLogout(); setIsMobileMenuOpen(false); }} />
            </div>
            <div className="mt-4 p-4 bg-stone-50 rounded-xl flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center text-sm font-bold shrink-0">{user.name.charAt(0)}</div>
               <div className="min-w-0">
                 <p className="text-sm font-bold text-stone-900 truncate">{user.name}</p>
                 <p className="text-xs text-stone-500 truncate">{user.email}</p>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="w-72 bg-white border-r border-stone-200 flex-col z-10 hidden md:flex shrink-0">
        <div className="h-20 flex items-center px-8 border-b border-stone-100">
          <div className="flex items-center gap-3 text-stone-900 font-bold text-xl tracking-tight">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center"><UtensilsCrossed size={22} /></div>
            <span className="font-serif">CuisineCourier</span>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-1">
          <SidebarItem icon={ShoppingBag} label="Browse Services" active={activeView === 'browse'} onClick={() => setActiveView('browse')} />
          <SidebarItem icon={Calendar} label="My Bookings" active={activeView === 'bookings'} onClick={() => setActiveView('bookings')} badge={upcomingBookings.length} />
          <SidebarItem icon={Settings} label="Settings" active={activeView === 'profile'} onClick={() => setActiveView('profile')} />
        </nav>
        <div className="p-6 border-t border-stone-100 bg-stone-50/50">
          <button onClick={onNavigateHome || (() => window.location.href = '/')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-stone-600 hover:bg-white hover:shadow-sm hover:text-stone-900 transition-all mb-3 group"><Home size={18} className="text-stone-400 group-hover:text-amber-600" /><span>Back to Home</span></button>
          <div className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white hover:shadow-sm transition-all cursor-pointer group border border-transparent hover:border-stone-100">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-bold shrink-0">{user.name.charAt(0)}</div>
              <div className="flex-1 min-w-0"><p className="text-sm font-bold text-stone-900 truncate">{user.name}</p><p className="text-xs text-stone-500 truncate">Client</p></div>
            </div>
            <button onClick={onLogout} className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><LogOut size={18} /></button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#FFFBEB] md:pt-0 pt-20">
        
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between px-8 py-6 bg-white/50 backdrop-blur-sm border-b border-stone-100">
          <div>
            <h1 className="font-serif text-3xl font-bold text-stone-900">
              {activeView === 'profile' ? 'Profile Settings' : activeView === 'browse' ? 'Services' : 'My Bookings'}
            </h1>
            <p className="text-stone-500 text-sm mt-1 font-light">
              {activeView === 'profile' ? 'Manage your account details and security.' : activeView === 'browse' ? 'Find the perfect catering for your next event.' : 'Manage your upcoming and past events.'}
            </p>
          </div>
          <div className="flex items-center gap-4">
             {activeView === 'browse' && (
               <div className="relative group">
                 <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-amber-600" />
                 <input type="text" placeholder="Search..." className="pl-11 pr-5 py-3 bg-white border border-stone-200 rounded-full text-sm focus:ring-2 focus:ring-amber-200 focus:border-amber-500 outline-none w-72 transition-all shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
               </div>
             )}
             <button className="relative p-3 bg-white border border-stone-200 rounded-full hover:shadow-md hover:border-amber-300 transition-all"><Bell size={20} className="text-stone-600" /><span className="absolute top-3 right-3 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white"></span></button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth pb-24 md:pb-8">
          
          {/* Mobile Search */}
          {activeView === 'browse' && (
            <div className="md:hidden mb-6 sticky top-0 z-30 py-2 -mx-4 px-4 bg-[#FFFBEB]">
               <div className="relative shadow-sm"><Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" /><input type="text" placeholder="Search services..." className="w-full pl-11 pr-5 py-4 bg-white border border-stone-200 rounded-2xl text-sm focus:ring-2 focus:ring-amber-200 focus:border-amber-500 outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
            </div>
          )}

          {/* --- PROFILE VIEW --- */}
          {activeView === 'profile' && (
            <ProfileSettings user={user} onLogout={onLogout} />
          )}

          {/* --- BROWSE VIEW --- */}
          {activeView === 'browse' && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => {
                  const displayImage = getImageUrl(service.image_url);
                  
                  return (
                    <div key={service.id} className="bg-white rounded-4xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
                      <div className="h-56 bg-stone-100 relative overflow-hidden">
                        <img 
                          src={displayImage}
                          alt={service.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                      </div>
                      <div className="p-6 flex flex-col grow">
                        <div className="flex items-start justify-between mb-6">
                          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl group-hover:bg-amber-100 transition-colors">
                            <UtensilsCrossed size={28} />
                          </div>
                          <span className="text-xl font-black text-stone-900">RWF {service.price_per_person.toLocaleString()}</span>
                        </div>
                        <h3 className="font-serif text-2xl font-bold text-stone-900 mb-3 leading-tight">{service.name}</h3>
                        <p className="text-sm text-stone-500 mb-6 line-clamp-2 leading-relaxed font-light">{service.description}</p>
                        
                        <button 
                            onClick={() => fetchReviewsForService(service.id)}
                            className="mb-6 text-sm font-bold text-stone-500 hover:text-amber-600 transition-colors flex items-center gap-1"
                        >
                            <Star size={16} className="fill-stone-200 text-stone-200" /> View Reviews
                        </button>

                        <button onClick={() => openBookingModal(service)} className="mt-auto w-full py-4 rounded-2xl bg-stone-900 text-white font-bold text-sm hover:bg-amber-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-stone-900/10 active:scale-95">Book Now <ChevronRight size={18} /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* --- BOOKINGS VIEW --- */}
          {activeView === 'bookings' && (
            <div className="space-y-10">
              
              {/* Upcoming Events */}
              <div>
                <div className="flex items-center justify-between mb-6">
                   <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-900 flex items-center gap-3"><Clock className="text-amber-500 w-6 h-6" /> Upcoming</h2>
                   <div className="md:hidden text-xs font-bold text-stone-400 uppercase tracking-wider">{upcomingBookings.length} Events</div>
                </div>

                {upcomingBookings.length === 0 ? (
                  <div className="bg-white p-12 rounded-4xl border-2 border-dashed border-stone-200 text-center"><div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4"><Calendar className="text-stone-300 w-8 h-8" /></div><p className="text-stone-500 font-medium">No upcoming events found.</p><button onClick={() => setActiveView('browse')} className="mt-6 px-6 py-3 bg-amber-100 text-amber-800 rounded-full font-bold text-sm hover:bg-amber-200 transition-colors">Browse Services</button></div>
                ) : (
                  <div className="space-y-6">
                    {upcomingBookings.map((booking) => {
                      const service = getServiceForBooking(booking.service_id);
                      const countdown = getCountdown(booking.event_date);
                      const totalCost = service ? service.price_per_person * booking.guests : 0;
                      
                      return (
                        <div key={booking.id} className="bg-white rounded-4xl border border-stone-100 shadow-sm hover:shadow-lg transition-all overflow-hidden">
                          <div className="flex flex-col md:flex-row">
                            {/* Left Side: Info */}
                            <div className="grow p-6 md:p-6 md:pr-8 w-full">
                              <div className="flex items-start gap-4 mb-4">
                                <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl shrink-0">
                                  <UtensilsCrossed size={28} />
                                </div>
                                <div className="min-w-0 grow">
                                  <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <h3 className="font-serif text-xl font-bold text-stone-900 leading-tight">{service?.name || 'Service #' + booking.service_id}</h3>
                                    <StatusBadge status={booking.status} />
                                  </div>
                                  <div className="flex items-center gap-2 text-stone-500 mb-4"><Calendar size={16} className="text-stone-400" /><span className="text-sm font-medium">{new Date(booking.event_date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span></div>
                                  {countdown && (<div className="inline-flex items-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-xl text-xs font-bold font-mono mb-4 shadow-md"><Clock size={14} /> {countdown.days}d {countdown.hours}h left</div>)}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-600">
                                    <div className="flex items-center gap-2 bg-stone-50 p-2.5 rounded-lg border border-stone-100"><Users size={14} /> <span className="truncate">{booking.guests} Guests</span></div>
                                    <div className="flex items-center gap-2 bg-stone-50 p-2.5 rounded-lg border border-stone-100"><MapPin size={14} /> <span className="truncate">{booking.location || 'TBD'}</span></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* Right Side: Action */}
                            <div className="w-full border-t md:border-t-0 md:border-l border-stone-100 p-6 md:p-6 md:pl-8 flex flex-col md:flex-row md:items-end justify-between md:gap-6 bg-stone-50/30 md:bg-transparent">
                              <div className="flex items-center justify-between w-full md:block md:text-right mb-4 md:mb-0">
                                <div>
                                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Total</p>
                                  <p className="text-2xl font-serif font-black text-stone-900">RWF {totalCost.toLocaleString()}</p>
                                </div>
                                <div className={`flex items-center gap-2 mt-2 md:mt-0 md:justify-end text-xs font-bold uppercase tracking-wide ${booking.payment_method === 'stripe' ? 'text-indigo-600' : booking.payment_method === 'momo' ? 'text-yellow-600' : 'text-blue-600'}`}>
                                  <CreditCard size={16} /> {booking.payment_method}
                                </div>
                              </div>
                              
                              {booking.status === 'pending' && (
                                <>
                                  {booking.payment_method === 'stripe' ? (
                                    <button 
                                      onClick={() => handlePayInvoice(booking)} 
                                      disabled={isProcessing}
                                      className="w-full md:w-auto px-6 py-4 bg-stone-900 hover:bg-amber-600 disabled:bg-stone-400 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-stone-900/10 flex items-center justify-center gap-2"
                                    >
                                      {isProcessing ? 'Processing...' : 'Pay Now'} <CreditCard size={16} />
                                    </button>
                                  ) : (
                                    <button 
                                      onClick={() => handlePayInvoice(booking)}
                                      className="w-full md:w-auto px-6 py-4 bg-blue-900 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
                                    >
                                      View Details <Home size={16} />
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* History */}
              <div>
                <div className="flex items-center justify-between mb-6"><h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-900 flex items-center gap-3"><Calendar className="text-stone-400 w-6 h-6" /> History</h2></div>
                {historyBookings.length === 0 ? (<p className="text-stone-400 text-center py-8">No past events found.</p>) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {historyBookings.map((booking) => {
                      const service = getServiceForBooking(booking.service_id);
                      const totalCost = service ? service.price_per_person * booking.guests : 0;
                      return (
                        <div key={booking.id} className="bg-white p-6 rounded-4xl border border-stone-100 shadow-sm relative overflow-hidden hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-4">
                            <div><h3 className="font-serif text-xl font-bold text-stone-900">{service?.name || 'Service #' + booking.service_id}</h3><p className="text-xs text-stone-400 mt-1">{new Date(booking.event_date).toLocaleDateString()}</p></div>
                            {booking.status === 'confirmed' && (<button onClick={() => openReviewModal(booking)} className="px-4 py-2 border border-stone-200 rounded-lg text-xs font-bold text-stone-600 hover:border-stone-900 hover:text-stone-900 transition-all">Write a review</button>)}
                          </div>
                          <div className="flex justify-between items-center pt-4 border-t border-stone-100">
                             <span className="font-bold text-stone-900">RWF {totalCost.toLocaleString()}</span>
                             <StatusBadge status={booking.status} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* --- BOOKING MODAL --- */}
      {selectedService && (
        <div className="fixed inset-0 z-100 bg-stone-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="h-40 bg-stone-900 relative shrink-0">
              <img src={getImageUrl(selectedService.image_url)} alt={selectedService.name} className="w-full h-full object-cover opacity-40" />
              <button onClick={closeBookingModal} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-md transition-colors"><X size={20} /></button>
             
              <div className="absolute bottom-0 left-0 w-full p-6 bg-linear-to-t from-stone-900 to-transparent">
                <h2 className="font-serif text-2xl sm:text-3xl font-black text-white">{selectedService.name}</h2>
                <p className="text-white/80 text-sm font-light mt-1">RWF {selectedService.price_per_person.toLocaleString()} / person</p>
              </div>
            </div>
            <form onSubmit={handleBookingSubmit} className="p-6 sm:p-8 overflow-y-auto">
              <div className="space-y-4 mb-8">
                {/* Payment Method Selector */}
                <div>
                  <label className="block text-[10px] font-bold uppercase text-stone-400 mb-2 tracking-wider">Payment Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['stripe', 'momo', 'bank'].map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setFormData({...formData, payment_method: method})}
                        className={`p-3 rounded-xl border text-sm font-bold capitalize transition-all ${
                          formData.payment_method === method 
                            ? 'border-amber-500 bg-amber-50 text-amber-800 ring-1 ring-amber-500' 
                            : 'border-stone-200 text-stone-500 hover:bg-stone-50'
                        }`}
                      >
                        {method === 'stripe' ? 'Card' : method}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-stone-400 mb-2 tracking-wider">Event Date</label>
                  <input type="date" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-5 py-4 bg-stone-50 border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-base rounded-xl" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-stone-400 mb-2 tracking-wider">Number of Guests</label>
                  <input type="number" required min="1" placeholder="e.g. 50" value={formData.guests} onChange={(e) => setFormData({...formData, guests: e.target.value})} className="w-full px-5 py-4 bg-stone-50 border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-base rounded-xl" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-stone-400 mb-2 tracking-wider">Event Location / Venue</label>
                  <input type="text" required placeholder="e.g. Kigali Marriott" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full px-5 py-4 bg-stone-50 border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-base rounded-xl" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-stone-400 mb-2 tracking-wider">Special Requests</label>
                  <textarea rows={3} placeholder="Dietary restrictions, setup requirements..." value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full px-5 py-4 bg-stone-50 border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-base rounded-xl resize-none leading-relaxed" />
                </div>
              </div>
              <div className="flex gap-4 mt-2">
                <button type="button" onClick={closeBookingModal} disabled={isProcessing} className="flex-1 py-4 rounded-2xl font-bold text-stone-600 hover:bg-stone-100 transition-colors text-base border border-transparent hover:border-stone-200 disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={isProcessing} className="flex-1 py-4 rounded-2xl font-bold bg-amber-500 text-white hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/25 text-base disabled:opacity-50 flex items-center justify-center gap-2">
                  {isProcessing ? 'Processing...' : (formData.payment_method === 'stripe' ? 'Pay & Book' : 'Confirm Booking')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- WRITE REVIEW MODAL --- */}
      {reviewingBooking && (
        <div className="fixed inset-0 z-100 bg-stone-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-6 sm:p-8 relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button onClick={closeReviewModal} className="absolute top-6 right-6 text-stone-400 hover:text-stone-600"><X size={24} /></button>
            <h2 className="font-serif text-2xl font-bold text-stone-900 mb-1">Review Experience</h2>
            <p className="text-sm text-stone-500 mb-8 font-light">How was your event?</p>
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-8">
                <label className="block text-xs font-bold uppercase text-stone-400 mb-4 tracking-wider">Rating</label>
                <div className="flex gap-3 justify-center">
                  <StarRating 
                    rating={reviewForm.rating} 
                    setRating={(r) => setReviewForm({...reviewForm, rating: r})} 
                  />
                </div>
              </div>
              <div className="mb-8">
                <label className="block text-xs font-bold uppercase text-stone-400 mb-2 tracking-wider">Your Feedback</label>
                <textarea rows={4} required placeholder="Tell us about your experience..." value={reviewForm.comment} onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})} className="w-full px-5 py-4 bg-stone-50 border border-stone-200 focus:border-amber-400 outline-none resize-none rounded-xl text-base" />
              </div>
              <button type="submit" className="w-full py-4 rounded-2xl font-bold bg-stone-900 text-white hover:bg-stone-800 transition-colors text-base shadow-lg shadow-stone-900/10">Submit Review</button>
            </form>
          </div>
        </div>
      )}

      {/* --- READ REVIEWS MODAL --- */}
      {viewingService && (
        <div className="fixed inset-0 z-100 bg-stone-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-6 sm:p-8 relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setViewingService(null)} className="absolute top-6 right-6 text-stone-400 hover:text-stone-600"><X size={24} /></button>
            
            <h2 className="font-serif text-2xl font-bold text-stone-900 mb-1">Reviews for {viewingService.name}</h2>
            <p className="text-sm text-stone-500 mb-6 font-light">What our customers are saying</p>
            
            {reviewsList.length === 0 ? (
                <div className="text-center py-8 text-stone-400">No reviews yet. Be the first!</div>
            ) : (
                <div className="space-y-4">
                    {reviewsList.map((review) => (
                        <div key={review.id} className="border-b border-stone-100 pb-4 last:border-0">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">
                                        {review.user_name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="font-bold text-sm text-stone-900">{review.user_name}</span>
                                </div>
                                <div className="flex text-yellow-400 text-xs">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} size={14} fill={star <= review.rating ? "currentColor" : "none"} />
                                    ))}
                                </div>
                            </div>
                            {review.comment && (
                                <p className="text-sm text-stone-600 italic">"{review.comment}"</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
          </div>
        </div>
      )}

      {/* --- TOAST --- */}
      {toast && (<Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />)}
    </div>
  );
};

// --- SUB COMPONENTS ---

const SidebarItem = ({ icon: Icon, label, active, onClick, badge }: any) => (
  <button onClick={onClick} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 group ${active ? 'bg-amber-50 text-amber-800 shadow-sm shadow-amber-100' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'}`}>
    <div className="flex items-center gap-3"><Icon size={20} className={active ? "text-amber-600" : "text-stone-400 group-hover:text-stone-600"} />{label}</div>
    {badge !== undefined && badge > 0 && (<span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${active ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-600'}`}>{badge}</span>)}
  </button>
);

const MobileMenuItem = ({ icon: Icon, label, active, onClick, badge }: any) => (
  <button onClick={onClick} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-base font-bold transition-colors ${active ? 'bg-amber-50 text-amber-800' : 'text-stone-600 hover:bg-stone-100'}`}>
    <div className="flex items-center gap-3"><Icon size={22} className={active ? "text-amber-600" : "text-stone-400"}/><span>{label}</span></div>
    {badge !== undefined && badge > 0 && (<span className="text-xs font-bold bg-amber-500 text-white px-2.5 py-0.5 rounded-full">{badge}</span>)}
  </button>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700 border border-amber-200',
    confirmed: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    preparation: 'bg-blue-50 text-blue-700 border-blue-200',
    completed: 'bg-stone-50 text-stone-700 border-stone-200',
    cancelled: 'bg-red-50 text-red-700 border border-red-200',
  };
  return (<span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[status] || styles.pending}`}>{status}</span>);
};

export default ClientDashboard;