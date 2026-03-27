import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Calendar, Plus, Check, DollarSign, 
  LogOut, Package, Clock, Users as UsersIcon, X, Image as ImageIcon, Edit, Trash2, Settings, Menu // ADDED: Icons for Sidebar
} from 'lucide-react';

// --- IMPORT PROFILE SETTINGS ---
import ProfileSettings from '../Components/ProfileSettings'; 

// --- DEFINED INTERFACE FOR TYPING ---
interface Service {
  id: number;
  name: string;
  description: string;
  price_per_person: string | number;
  image_url?: string;
  provider_id: number;
}

const ProviderDashboard = ({ user, onLogout }: { user: any; onLogout: () => void }) => {
  // --- STATE ---
  const [activeView, setActiveView] = useState<'dashboard' | 'settings'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [bookings, setBookings] = useState<any[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  
  const [newService, setNewService] = useState({ 
    name: '', 
    description: '', 
    price_per_person: '' 
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (activeView === 'dashboard') {
      fetchData();
    }
  }, [activeView]);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    
    // Fetch Bookings
    try {
      const bRes = await fetch('http://127.0.0.1:8000/bookings/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (bRes.ok) setBookings(await bRes.json());
    } catch (e) { console.error(e); }

    // Fetch Services
    try {
      const sRes = await fetch('http://127.0.0.1:8000/services/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (sRes.ok) setServices(await sRes.json());
    } catch (e) { console.error(e); }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(editingService ? (getImageUrl(editingService.image_url) || null) : null);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setNewService({
      name: service.name,
      description: service.description,
      price_per_person: String(service.price_per_person)
    });
    setImagePreview(getImageUrl(service.image_url) || null); 
    setSelectedImage(null); 
  };

  const handleCancelEdit = () => {
    setEditingService(null);
    setNewService({ name: '', description: '', price_per_person: '' });
    setImagePreview(null);
    setSelectedImage(null);
  };

  const handleDeleteService = async (id: number) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://127.0.0.1:8000/services/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchData();
        alert("Service deleted successfully");
      } else {
        alert("Failed to delete service");
      }
    } catch (err) { console.error(err); }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    const formData = new FormData();
    formData.append('name', newService.name);
    formData.append('description', newService.description);
    formData.append('price_per_person', newService.price_per_person);
    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    try {
      let res;
      if (editingService) {
        res = await fetch(`http://127.0.0.1:8000/services/${editingService.id}`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
      } else {
        res = await fetch('http://127.0.0.1:8000/services/', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
      }

      if (res.ok) {
        handleCancelEdit();
        fetchData(); 
        alert(editingService ? "Service updated!" : "Service published!");
      } else {
        alert("Failed to save service");
      }
    } catch (err) { console.error(err); }
  };

  const handleConfirmBooking = async (id: number) => {
    const token = localStorage.getItem("token");
    await fetch(`http://127.0.0.1:8000/bookings/${id}/confirm`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchData(); 
  };

  const getImageUrl = (url: string | undefined): string | undefined => {
    if (!url) return undefined;
    if (url.startsWith('http')) return url;
    return `http://127.0.0.1:8000/${url}`;
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans selection:bg-orange-100 selection:text-orange-700 overflow-hidden">
      
      {/* --- MOBILE OVERLAY --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="h-20 flex items-center px-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-orange-500 rounded-xl shadow-lg shadow-orange-200 text-white">
                <Briefcase size={24} />
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Provider Portal</h1>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="ml-auto md:hidden text-slate-500">
              <X size={24} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
            <SidebarItem 
              icon={<Briefcase size={20} />} 
              label="Dashboard" 
              active={activeView === 'dashboard'} 
              onClick={() => { setActiveView('dashboard'); setIsMobileMenuOpen(false); }} 
            />
            <SidebarItem 
              icon={<Settings size={20} />} 
              label="Profile Settings" 
              active={activeView === 'settings'} 
              onClick={() => { setActiveView('settings'); setIsMobileMenuOpen(false); }} 
            />
          </nav>

          {/* User Profile / Logout */}
          <div className="p-4 border-t border-slate-100 bg-slate-50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                {user?.name?.charAt(0) || 'P'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">Provider</p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all shadow-sm"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-600">
              <Menu size={24} />
            </button>
            <span className="font-bold text-lg text-slate-900">Provider Portal</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs">
            {user?.name?.charAt(0) || 'P'}
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          
          {/* --- VIEW: DASHBOARD --- */}
          {activeView === 'dashboard' && (
            <div className="space-y-8">
              {/* Desktop Header (Optional, or just use Sidebar) */}
              <div className="hidden md:flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
                <div className="text-sm text-slate-500">Welcome back, {user?.name}</div>
              </div>

              {/* --- KPI STATS ROW --- */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                  title="Active Services" 
                  value={services.length} 
                  icon={<Package className="text-orange-500" size={24} />} 
                  color="bg-orange-50"
                  trend="Listed on platform"
                />
                <StatCard 
                  title="Pending Bookings" 
                  value={bookings.filter(b => b.status === 'pending').length} 
                  icon={<Clock className="text-amber-500" size={24} />} 
                  color="bg-amber-50"
                  trend="Awaiting confirmation"
                />
                <StatCard 
                  title="Confirmed Events" 
                  value={bookings.filter(b => b.status === 'confirmed').length} 
                  icon={<Calendar className="text-emerald-500" size={24} />} 
                  color="bg-emerald-50"
                  trend="Scheduled and paid"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* --- LEFT COLUMN: SERVICES --- */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Add/Edit Service Form */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-slate-50 px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-orange-100 text-orange-600 rounded-lg">
                          {editingService ? <Edit size={20} /> : <Plus size={20} />}
                        </div>
                        <h2 className="font-bold text-slate-800">
                          {editingService ? 'Edit Service' : 'Add New Service'}
                        </h2>
                      </div>
                      {editingService && (
                        <button 
                          onClick={handleCancelEdit}
                          className="text-xs font-medium text-slate-500 hover:text-slate-800 underline"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <form onSubmit={handleAddService} className="space-y-5">
                        
                        {/* Image Upload Area */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Service Image</label>
                          <div className="relative group">
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={handleImageChange}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors ${
                              imagePreview ? 'border-orange-400 bg-orange-50' : 'border-slate-300 hover:border-orange-400 bg-slate-50'
                            }`}>
                              {imagePreview ? (
                                <div className="relative w-full h-32 mb-2">
                                  <img src={imagePreview} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                                  {editingService && (
                                    <button 
                                      type="button"
                                      onClick={handleRemoveImage}
                                      className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm text-red-500 hover:bg-red-50"
                                    >
                                      <X size={14} />
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <ImageIcon className="text-slate-400 mb-2" size={32} />
                              )}
                              <p className="text-xs font-medium text-slate-600">
                                {imagePreview ? 'Change image' : 'Click to upload image'}
                              </p>
                              <p className="text-[10px] text-slate-400">PNG, JPG up to 5MB</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Service Name</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Wedding Buffet"
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-slate-900 outline-none placeholder:text-slate-400"
                            value={newService.name}
                            onChange={e => setNewService({...newService, name: e.target.value})}
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Description</label>
                          <textarea
                            placeholder="e.g. A full three-course meal..."
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-slate-900 outline-none placeholder:text-slate-400 resize-none"
                            value={newService.description}
                            onChange={e => setNewService({...newService, description: e.target.value})}
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Price Per Guest (RWF)</label>
                          <input 
                            type="number" 
                            step="1"
                            placeholder="0.00 RWF"
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-slate-900 outline-none placeholder:text-slate-400"
                            value={newService.price_per_person}
                            onChange={e => setNewService({...newService, price_per_person: e.target.value})}
                            required
                          />
                        </div>

                        <button 
                          type="submit" 
                          className="w-full bg-linear-to-r from-orange-500 to-amber-500 text-white py-3.5 rounded-xl hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all duration-200 font-bold tracking-wide text-sm"
                        >
                          {editingService ? 'Update Service' : 'Publish Service'}
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Service List */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                    <div className="px-6 py-5 border-b border-slate-100">
                      <h2 className="font-bold text-slate-800">My Services</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto max-h-125">
                      {services.map((s) => (
                        <div key={s.id} className="p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors group">
                          <div className="flex gap-4">
                            {getImageUrl(s.image_url) ? (
                              <img 
                                src={getImageUrl(s.image_url)} 
                                alt={s.name} 
                                className="w-16 h-16 rounded-lg object-cover bg-slate-100"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center text-slate-300">
                                <ImageIcon size={20} />
                              </div>
                            )}

                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <p className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{s.name}</p>
                                <div className="bg-orange-50 text-orange-700 px-3 py-1.5 rounded-lg font-bold text-sm whitespace-nowrap">
                                  RWF {s.price_per_person}
                                </div>
                              </div>
                              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{s.description}</p>
                            </div>

                            <div className="flex flex-col gap-2 justify-center ml-2">
                              <button 
                                onClick={() => handleEdit(s)}
                                className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteService(s.id)}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {services.length === 0 && (
                        <div className="p-8 text-center text-slate-400">
                          <Package size={48} className="mx-auto mb-3 opacity-20" />
                          <p className="text-sm font-medium">No services listed yet.</p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* --- RIGHT COLUMN: BOOKINGS --- */}
                <div className="lg:col-span-7">
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col">
                    <div className="bg-slate-50 px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-slate-200 text-slate-600 rounded-lg">
                          <Calendar size={20} />
                        </div>
                        <h2 className="font-bold text-slate-800">Incoming Bookings</h2>
                      </div>
                      <span className="text-xs font-medium px-2.5 py-1 bg-white border border-slate-200 rounded-md text-slate-500">
                        {bookings.length} Total
                      </span>
                    </div>
                    
                    <div className="p-6 space-y-4 overflow-y-auto max-h-150">
                      {bookings.map((b) => (
                        <div key={b.id} className="group relative bg-white border border-slate-100 rounded-xl p-5 hover:shadow-md hover:border-orange-100 transition-all duration-300">
                          
                          {/* Header: Status & ID */}
                          <div className="flex justify-between items-start mb-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${
                              b.status === 'confirmed' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                              : 'bg-amber-50 text-amber-700 border-amber-100'
                            }`}>
                              {b.status === 'confirmed' ? <Check size={12} /> : <Clock size={12} />}
                              {b.status.toUpperCase()}
                            </span>
                            <span className="text-xs font-mono text-slate-400">#{b.id}</span>
                          </div>

                          {/* Details Grid */}
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-slate-600">
                              <div className="p-1.5 bg-slate-100 rounded-md text-slate-500">
                                <Calendar size={14} />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs text-slate-400 uppercase">Date</span>
                                <span className="text-sm font-semibold">{b.event_date}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                              <div className="p-1.5 bg-slate-100 rounded-md text-slate-500">
                                <UsersIcon size={14} />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs text-slate-400 uppercase">Guests</span>
                                <span className="text-sm font-semibold">{b.guests}</span>
                              </div>
                            </div>
                          </div>

                          {/* Action Footer */}
                          <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                            {b.status === 'pending' ? (
                              <button 
                                onClick={() => handleConfirmBooking(b.id)}
                                className="flex-1 bg-slate-900 text-white py-2.5 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                              >
                                <Check size={16} /> Confirm Booking
                              </button>
                            ) : (
                              <div className="flex-1 flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50 py-2.5 rounded-lg text-sm font-medium">
                                <DollarSign size={16} /> Payment Verified
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {bookings.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                          <Calendar size={64} className="mb-4 opacity-20" />
                          <p className="text-sm font-medium">No bookings found yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- VIEW: SETTINGS --- */}
          {activeView === 'settings' && (
             <ProfileSettings user={user} onLogout={onLogout} />
          )}

        </div>
      </main>
    </div>
  );
};

// --- Sub-Components ---

const SidebarItem = ({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
      active 
        ? 'bg-orange-50 text-orange-700' 
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`}
  >
    <div className={active ? "text-orange-600" : "text-slate-400"}>
      {icon}
    </div>
    {label}
  </button>
);

const StatCard = ({ title, value, icon, color, trend }: { title: string; value: string | number; icon: React.ReactNode; color: string; trend: string }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        {icon}
      </div>
    </div>
    <div className="mt-4 flex items-center text-xs font-medium text-slate-400">
      <span className="text-slate-600 mr-1">{trend}</span>
    </div>
  </div>
);

export default ProviderDashboard;