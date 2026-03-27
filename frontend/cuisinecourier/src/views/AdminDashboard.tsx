import React, { useState, useEffect } from 'react';
import { 
  Shield, UserPlus, Users, LogOut, Building2, Mail, Lock, User as UserIcon, 
  CheckCircle, AlertCircle, Settings, Menu, X, Activity 
} from 'lucide-react';

// --- IMPORT PROFILE SETTINGS ---
import ProfileSettings from '../Components/ProfileSettings';

const AdminDashboard = ({ user, onLogout }: { user: any; onLogout: () => void }) => {
  // --- STATE ---
  const [activeView, setActiveView] = useState<'dashboard' | 'settings'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [users, setUsers] = useState<any[]>([]);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', business_name: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (activeView === 'dashboard') {
      fetchUsers();
    }
  }, [activeView]);

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. User might not be logged in.");
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.status === 401) {
        console.error("Unauthorized access (401). Token invalid.");
        setMessage("⚠️ Session expired. Please login again.");
        setTimeout(() => onLogout(), 2000); 
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error("Failed to fetch users:", errorData);
        setMessage(`❌ Error: ${errorData.detail || "Failed to load users"}`);
      }
    } catch (err) {
      console.error("Network error:", err);
      setMessage('❌ Failed to connect to server');
    }
  };

  const handleCreateProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("❌ You must be logged in to perform this action.");
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/admin/create-provider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.status === 401) {
        setMessage("⚠️ Session expired. Logging out...");
        setTimeout(() => onLogout(), 2000);
        return;
      }

      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ ${data.message}`);
        setFormData({ name: '', email: '', password: '', business_name: '' });
        fetchUsers();
      } else {
        setMessage(`❌ ${data.detail || "Creation failed"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to connect to server');
    }
  };

  const getAvatarColor = (name: string) => {
    const colors = ['bg-blue-100 text-blue-600', 'bg-purple-100 text-purple-600', 'bg-indigo-100 text-indigo-600', 'bg-violet-100 text-violet-600'];
    return colors[name.length % colors.length];
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-700 overflow-hidden">
      
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
              <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200 text-white">
                <Shield size={24} />
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Admin Panel</h1>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="ml-auto md:hidden text-slate-500">
              <X size={24} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
            <SidebarItem 
              icon={<Activity size={20} />} 
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
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">Admin</p>
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
            <span className="font-bold text-lg text-slate-900">Admin Panel</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
            {user?.name?.charAt(0) || 'A'}
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          
          {/* --- VIEW: DASHBOARD --- */}
          {activeView === 'dashboard' && (
            <div className="space-y-8">
              <div className="hidden md:flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">System Overview</h2>
                <div className="text-sm text-slate-500">Administrator Access</div>
              </div>

              {/* --- KPI STATS --- */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KpiCard 
                  title="Total Users" 
                  value={users.length} 
                  icon={<Users className="text-blue-600" size={24} />} 
                  color="bg-blue-50"
                  trend="+5% this week"
                />
                <KpiCard 
                  title="Active Providers" 
                  value={users.filter(u => u.role === 'PROVIDER').length} 
                  icon={<Building2 className="text-purple-600" size={24} />} 
                  color="bg-purple-50"
                  trend="2 new today"
                />
                <KpiCard 
                  title="System Status" 
                  value="Healthy" 
                  icon={<CheckCircle className="text-emerald-600" size={24} />} 
                  color="bg-emerald-50"
                  trend="All systems go"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* --- LEFT: CREATE PROVIDER --- */}
                <div className="lg:col-span-5">
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-slate-50 px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
                          <UserPlus size={20} />
                        </div>
                        <h2 className="font-bold text-slate-800">Create Provider</h2>
                      </div>
                    </div>

                    <div className="p-6">
                      {message && (
                        <div className={`mb-6 p-4 rounded-xl text-sm font-medium flex items-start gap-3 animate-in slide-in-from-top-2 duration-300 ${
                          message.includes('✅') 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                          : 'bg-red-50 text-red-700 border border-red-100'
                        }`}>
                          {message.includes('✅') ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                          <span>{message}</span>
                        </div>
                      )}

                      <form onSubmit={handleCreateProvider} className="space-y-5">
                        
                        {/* Input Groups */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                              <UserIcon size={18} />
                            </div>
                            <input 
                              type="text" required
                              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900 outline-none placeholder:text-slate-400"
                              placeholder="e.g. John Doe"
                              value={formData.name}
                              onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Business Name</label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                              <Building2 size={18} />
                            </div>
                            <input 
                              type="text" 
                              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900 outline-none placeholder:text-slate-400"
                              placeholder="e.g. Elite Catering"
                              value={formData.business_name}
                              onChange={e => setFormData({...formData, business_name: e.target.value})}
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                              <Mail size={18} />
                            </div>
                            <input 
                              type="email" required
                              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900 outline-none placeholder:text-slate-400"
                              placeholder="provider@example.com"
                              value={formData.email}
                              onChange={e => setFormData({...formData, email: e.target.value})}
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Temporary Password</label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                              <Lock size={18} />
                            </div>
                            <input 
                              type="password" required
                              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900 outline-none placeholder:text-slate-400"
                              placeholder="••••••••"
                              value={formData.password}
                              onChange={e => setFormData({...formData, password: e.target.value})}
                            />
                          </div>
                        </div>

                        <button 
                          type="submit" 
                          className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-200 font-bold tracking-wide text-sm"
                        >
                          Create Account
                        </button>
                      </form>
                    </div>
                  </div>
                </div>

                {/* --- RIGHT: USER LIST --- */}
                <div className="lg:col-span-7">
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full">
                    <div className="bg-slate-50 px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-slate-200 text-slate-600 rounded-lg">
                          <Users size={20} />
                        </div>
                        <h2 className="font-bold text-slate-800">System Users</h2>
                      </div>
                      <span className="text-xs font-medium px-2.5 py-1 bg-white border border-slate-200 rounded-md text-slate-500">
                        {users.length} Total
                      </span>
                    </div>
                    
                    <div className="flex-1 overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {users.map((u) => (
                            <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${getAvatarColor(u.name)}`}>
                                    {u.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-medium text-slate-900">{u.name}</p>
                                    <p className="text-xs text-slate-500">{u.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border
                                  ${u.role === 'ADMIN' 
                                    ? 'bg-red-50 text-red-700 border-red-100' 
                                    : u.role === 'PROVIDER' 
                                    ? 'bg-purple-50 text-purple-700 border-purple-100' 
                                    : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                  {u.role}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                  Active
                                </span>
                              </td>
                            </tr>
                          ))}
                          {users.length === 0 && (
                            <tr>
                              <td colSpan={3} className="px-6 py-12 text-center">
                                <div className="flex flex-col items-center justify-center text-slate-400">
                                  <Users size={48} className="mb-3 opacity-20" />
                                  <p className="text-sm font-medium">No users found in the system.</p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
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
        ? 'bg-indigo-50 text-indigo-700' 
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`}
  >
    <div className={active ? "text-indigo-600" : "text-slate-400"}>
      {icon}
    </div>
    {label}
  </button>
);

const KpiCard = ({ title, value, icon, color, trend }: { title: string; value: string | number; icon: React.ReactNode; color: string; trend: string }) => (
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

export default AdminDashboard;