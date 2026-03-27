import React, { useState } from 'react';
// --- FIX: Renamed 'User' to 'UserIcon' to avoid conflict with the 'User' type ---
import { Hexagon, User as UserIcon, Lock, ArrowLeft, Loader2, UserPlus, Eye, EyeOff } from 'lucide-react';

// --- 1. IMPORT USER TYPE ---
import type { User } from '../types';

// --- 2. UPDATE INTERFACE TO USE USER TYPE ---
interface AuthViewProps {
  onAuthSuccess: (user: User) => void; 
  onBack: () => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onAuthSuccess, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  
  // --- State ---
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // --- API Authentication Logic ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const API_URL = "http://127.0.0.1:8000/auth";

    try {
      const endpoint = isLogin ? "login" : "register";
      
      let body: any;
      const headers: Record<string, string> = {};

      // 1. Login expects Form Data (URLSearchParams) with 'username' field
      if (isLogin) {
        body = new URLSearchParams();
        body.append("username", email); // OAuth2 uses 'username' for email
        body.append("password", password);
        headers["Content-Type"] = "application/x-www-form-urlencoded";
      } 
      // 2. Register expects Multipart Form Data
      else {
        body = new FormData();
        body.append("name", name);
        body.append("email", email);
        body.append("password", password);
        body.append("role", "CLIENT");
        // Do NOT set Content-Type manually for FormData, browser handles the boundary
      }

      // 3. Call the API
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: "POST",
        headers: headers,
        body: body,
      });

      const data = await response.json();

      // 4. Handle Errors
      if (!response.ok) {
        throw new Error(data.detail || "Authentication failed");
      }

      // 5. Handle Success
      // Backend returns flat object: { access_token, id, name, email, role }
      if (data.access_token) {
        // Construct the User object expected by App.tsx
        const userPayload: User = {
          id: String(data.id), // Ensure ID is a string if your type requires it
          email: data.email, 
          name: data.name, 
          role: data.role
        };

        // Attach the token to the object so App.tsx can find it
        (userPayload as any).access_token = data.access_token;

        onAuthSuccess(userPayload);
      } else {
        throw new Error("Server did not return a token");
      }

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFFBEB] flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-4">
          <Loader2 className="animate-spin text-amber-600 w-8 h-8" />
        </div>
        <p className="text-stone-500 font-serif text-lg">Connecting to server...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBEB] flex items-center justify-center p-4 md:p-0 relative overflow-hidden font-sans">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-40">
         <div className="absolute top-[-10%] left-[-10%] w-200 h-200 bg-amber-200/40 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-240 h-240 bg-stone-200/50 rounded-full blur-[100px]"></div>
      </div>

      {/* Back Button */}
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center space-x-2 text-stone-500 hover:text-stone-900 transition-colors font-bold text-xs uppercase tracking-widest z-20 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-stone-100"
      >
        <ArrowLeft size={14} />
        <span>Back Home</span>
      </button>

      <div className="w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-160">
        
        {/* --- LEFT: Brand / Visual Only --- */}
        <div className="hidden md:flex flex-col justify-center p-16 bg-stone-900 text-amber-50 relative overflow-hidden h-full">
           {/* Background Pattern */}
           <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
           
           <div className="relative z-10">
              {/* Branding Text */}
              <h1 className="font-serif text-5xl font-bold leading-tight mb-6">
                Where flavor <br/> meets logistics.
              </h1>
              <p className="text-stone-300 font-light leading-relaxed max-w-sm text-lg">
                Join the platform that powers Rwanda's finest catering events. Manage menus, stock, and staff all in one place.
              </p>
           </div>
           <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-black/20 to-transparent pointer-events-none"></div>
        </div>

        {/* --- RIGHT: Form --- */}
        <div className="p-8 md:p-16 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full">
            
            {/* Mobile Logo */}
            <div className="md:hidden text-center mb-8">
               <div className="inline-block p-3 bg-amber-100 rounded-full text-stone-900 mb-2">
                 <Hexagon size={32} fill="currentColor" strokeWidth={0} />
               </div>
               <h2 className="font-serif text-2xl font-bold text-stone-900">Cuisine Courier</h2>
            </div>

            <h2 className="font-serif text-3xl md:text-4xl font-black text-stone-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Join the Family'}
            </h2>
            <p className="text-stone-500 mb-8 font-light text-sm md:text-base">
              {isLogin 
                ? 'Enter your credentials to access the dashboard.' 
                : 'Create an account to start managing your events.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-xl flex items-start gap-3">
                  <span className="mt-0.5">⚠️</span>
                  {error}
                </div>
              )}

              {/* Name Input */}
              {!isLogin && (
                <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                  <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 ml-1">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400 group-focus-within:text-amber-600 transition-colors">
                      <UserPlus size={18} />
                    </div>
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-stone-50 border border-transparent focus:bg-white focus:border-stone-200 focus:ring-4 focus:ring-amber-100 transition-all font-medium text-stone-900 placeholder-stone-400 outline-none"
                      placeholder="e.g. Sarah Mugabo"
                    />
                  </div>
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400 group-focus-within:text-amber-600 transition-colors">
                    <UserIcon size={18} />
                  </div>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-stone-50 border border-transparent focus:bg-white focus:border-stone-200 focus:ring-4 focus:ring-amber-100 transition-all font-medium text-stone-900 placeholder-stone-400 outline-none"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400 group-focus-within:text-amber-600 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3.5 rounded-2xl bg-stone-50 border border-transparent focus:bg-white focus:border-stone-200 focus:ring-4 focus:ring-amber-100 transition-all font-medium text-stone-900 placeholder-stone-400 outline-none"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-stone-900 text-amber-50 font-bold py-4 rounded-2xl hover:bg-stone-800 hover:shadow-lg hover:shadow-stone-900/20 transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-4 text-sm uppercase tracking-wide"
              >
                {isLogin ? "Sign In to Dashboard" : "Create My Account"}
              </button>
              
              {/* Toggle Mode Link */}
              <div className="text-center pt-2">
                <button 
                  type="button"
                  onClick={() => { setIsLogin(!isLogin); setError(null); }}
                  className="text-sm text-stone-500 hover:text-stone-900 font-medium transition-colors"
                >
                  {isLogin ? "New here? " : "Already a member? "}
                  <span className="underline underline-offset-4 decoration-amber-500/50 hover:decoration-amber-500 font-bold">
                    {isLogin ? "Create an account" : "Log in instead"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthView;