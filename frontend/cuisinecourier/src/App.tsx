import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import type { User } from './types';

// --- IMPORT VIEWS ---
import LandingView from './views/LandingView';
import ServicesPage from './views/ServicesView';
import AboutPage from './views/AboutPage';       
import ContactPage from './views/ContactPage';
import AuthView from './views/AuthView';
import GalleryPage from './views/GalleryPage';
import AdminDashboard from './views/AdminDashboard';
import ProviderDashboard from './views/ProviderDashboard';
import ClientDashboard from './views/ClientDashboard';

// --- IMPORT COMPONENTS ---
import Navbar from './Components/Navbar'; 
import Footer from './Components/Footer';

// --- TYPES ---
type ViewType = 'landing' | 'services' | 'about' | 'gallery' | 'contact' | 'auth' | 'dashboard';

// --- AUTH CONTEXT (Global) ---
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

// --- AUTH PROVIDER ---
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); 

  // 1. LOAD USER FROM STORAGE ON MOUNT
  useEffect(() => {
    const storedUserStr = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token"); 

    if (storedUserStr && storedToken) {
      try {
        const storedUser = JSON.parse(storedUserStr);
        setUser(storedUser);
      } catch (e) {
        console.error("Failed to parse user session", e);
        localStorage.removeItem("user");
        localStorage.removeItem("token"); 
      }
    }
    setLoading(false);
  }, []);

  // 2. LOGIN METHOD
  const login = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token); 
  };

  // 3. LOGOUT METHOD
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token"); 
  };

  const value = { user, loading, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// --- MAIN APP COMPONENT ---
const App: React.FC = () => {
  const { user, loading, login, logout } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('landing');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // HELPER: Determine if a route should show Navbar/Footer
  const isPublicRoute = (view: ViewType) => 
    ['landing', 'services', 'about', 'gallery', 'contact', 'auth'].includes(view);

  // WRAPPER FOR NAVIGATE TO AVOID RE-CREATION
  const navigate = useCallback((view: ViewType) => {
    if (currentView === view) return;

    setIsTransitioning(true);
    
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      setCurrentView(view);
      setIsTransitioning(false);
    }, 300); // Matches CSS transition duration
  }, [currentView]);

  // NAVIGATE TO AUTH IF PROTECTED
  const handleNavigate = useCallback((view: ViewType) => {
    if (view === 'dashboard') {
      if (!user) {
        navigate('auth');
        return;
      }
    }
    navigate(view);
  }, [navigate, user]);

  // LOGOUT HANDLER
  const handleLogout = () => {
    logout();
    navigate('landing');
  };

  // AUTH SUCCESS (Called from AuthView)
  const handleAuthSuccess = (userData: User) => {
    // Look for 'access_token' first (standard FastAPI), fallback to 'token'
    const token = (userData as any).access_token || (userData as any).token || ""; 

    if (!token) {
        console.error("Login failed: No token found in response", userData);
        // Note: Ideally use a toast notification here instead of alert
        return;
    }

    login(userData, token);
    navigate('dashboard');
  };

  // SCROLL TO TOP & RESET
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (currentView !== 'landing') {
      setCurrentView('landing');
    }
  };

  // --- HANDLERS FOR ABOUT PAGE BUTTONS ---
  const handleStoryClick = useCallback(() => {
    // If we are already on the about page, scroll to the section
    if (currentView === 'about') {
      const element = document.getElementById('our-story');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If we are elsewhere, go to About page then scroll
      navigate('about');
      setTimeout(() => {
        const element = document.getElementById('our-story');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 350); // Slight delay to allow render
    }
  }, [currentView, navigate]);

  const handlePartnerClick = useCallback(() => {
    // Usually partner inquiries lead to a contact form
    navigate('contact');
  }, [navigate]);

  // --- RENDER CONTENT LOGIC ---
  const renderView = () => {
    if (loading) {
      return (
        <div className="flex h-screen items-center justify-center bg-stone-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900"></div>
        </div>
      );
    }

    const opacityClass = isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0';

    switch (currentView) {
      case 'landing':
        return (
          <div className={`transition-all duration-300 ease-in-out ${opacityClass}`}>
            <LandingView 
              onGetStarted={() => handleNavigate('auth')} 
              onViewMenus={() => handleNavigate('services')} 
            />
          </div>
        );

      case 'services':
        return (
          <div className={`transition-all duration-300 ease-in-out ${opacityClass}`}>
            <ServicesPage onGetStarted={() => handleNavigate('auth')} />
          </div>
        );

      case 'about':
        return (
          <div className={`transition-all duration-300 ease-in-out ${opacityClass}`}>
            {/* IMPROVEMENT: Passing the click handlers we defined above */}
            <AboutPage 
              onStoryClick={handleStoryClick} 
              onPartnerClick={handlePartnerClick} 
            />
          </div>
        );

      case 'contact':
        return (
          <div className={`transition-all duration-300 ease-in-out ${opacityClass}`}>
            <ContactPage />
          </div>
        );

      case 'gallery':
        return (
          <div className={`transition-all duration-300 ease-in-out ${opacityClass}`}>
            <GalleryPage />
          </div>
        );

      case 'auth':
        return (
          <div className={`transition-all duration-300 ease-in-out ${opacityClass}`}>
            <AuthView 
              onAuthSuccess={handleAuthSuccess} 
              onBack={() => handleNavigate('landing')} 
            />
          </div>
        );

      case 'dashboard':
        if (!user) return null; 
        if (user.role === 'ADMIN') {
          return <div className={`transition-all duration-300 ease-in-out ${opacityClass}`}><AdminDashboard user={user} onLogout={handleLogout} /></div>;
        }
        if (user.role === 'PROVIDER') {
          return <div className={`transition-all duration-300 ease-in-out ${opacityClass}`}><ProviderDashboard user={user} onLogout={handleLogout} /></div>;
        }
        if (user.role === 'CLIENT') {
          return <div className={`transition-all duration-300 ease-in-out ${opacityClass}`}><ClientDashboard user={user} onLogout={handleLogout} onNavigateHome={() => handleNavigate('landing')} /></div>;
        }
        return null;

      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      {/* Navbar */}
      {isPublicRoute(currentView) && (
        <Navbar 
          user={user} 
          onLogout={handleLogout} 
          onBrandClick={scrollToTop} 
          onDashboardClick={() => handleNavigate('dashboard')}
          currentView={currentView}
          onGetStarted={() => handleNavigate('auth')}
          onServicesClick={() => handleNavigate('services')}
          onGalleryClick={() => handleNavigate('gallery')} 
          onAboutClick={() => handleNavigate('about')}
          onContactClick={() => handleNavigate('contact')}
        />
      )}
      
      {/* Main Content */}
      {/* Added overflow-hidden to prevent horizontal scroll during transition animations */}
      <main className="grow w-full relative overflow-x-hidden">
        {renderView()}
      </main>
   
      {/* Footer */}
      {isPublicRoute(currentView) && (
         <Footer 
          onBrandClick={scrollToTop} 
          onServicesClick={() => handleNavigate('services')} 
          onGalleryClick={() => handleNavigate('gallery')}     
          onAboutClick={() => navigate('about')}         
          onDashboardClick={() => handleNavigate('dashboard')} 
        /> 
      )}
    </div>
  );
};

export default App;