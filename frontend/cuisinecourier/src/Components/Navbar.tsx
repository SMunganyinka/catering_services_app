import React, { useState } from 'react';
import type { User } from '../types';
import { Menu, X, LogOut, User as UserIcon, ChevronDown } from 'lucide-react';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onBrandClick: () => void;
  onDashboardClick: () => void;
  currentView: string;
  onGetStarted: () => void;
  onServicesClick?: () => void;
  onGalleryClick?: () => void;
  onAboutClick?: () => void;
  onContactClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  user, 
  onLogout, 
  onBrandClick, 
  onDashboardClick, 
  currentView,
  onGetStarted,
  onServicesClick = () => {}, 
  onGalleryClick = () => {},   
  onAboutClick = () => {},
  onContactClick = () => {}
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', action: onBrandClick, id: 'landing' },
    { label: 'About Us', action: onAboutClick || (() => {}), id: 'about' },
    { label: 'Services', action: onServicesClick || (() => {}), id: 'services' },
    { label: 'Gallery', action: onGalleryClick || (() => {}), id: 'gallery' },
    { label: 'Contact', action: onContactClick || (() => {}), id: 'contact' },
    ...(user ? [{ label: 'Dashboard', action: onDashboardClick, id: 'dashboard' }] : []),
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      {/* Fixed Header Container */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6"> {/* FIXED: Aligned px-6 */}
          <div className="flex justify-between items-center h-24"> {/* FIXED: Increased height to h-12 for logo fit */}

            {/* 1. Logo */}
            <button 
              onClick={onBrandClick}
              className="flex items-center space-x-3 group focus:outline-none"
              aria-label="Cuisine Courier Home"
            >
              <div className="relative w-14 h-14 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg 
                  viewBox="0 0 24 24" 
                  className="w-full h-full drop-shadow-lg text-yellow-400" 
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* 1. Yellow Hexagon Background */}
                  <path d="M12 2L21 6.5V17.5L12 22L3 17.5V6.5L12 2Z" />
                  
                  {/* 2. Three Solid White Bowls Stacked */}
                  <g fill="white">
                    {/* Top Bowl */}
                    <path d="M6.5 7.5H17.5C17.5 7.5 17.5 9.5 12 9.5C6.5 9.5 6.5 7.5 6.5 7.5Z" />
                    <path d="M6.5 7.5C6.5 9 8.5 9.5 12 9.5C15.5 9.5 17.5 9 17.5 7.5C17.5 6 15.5 5.5 12 5.5C8.5 5.5 6.5 6 6.5 7.5Z" opacity="0.5"/>
                    
                    {/* Middle Bowl */}
                    <path d="M6.5 11H17.5C17.5 11 17.5 13 12 13C6.5 13 6.5 11 6.5 11Z" />
                    <path d="M6.5 11C6.5 12.5 8.5 13 12 13C15.5 13 17.5 12.5 17.5 11C17.5 9.5 15.5 9 12 9C8.5 9 6.5 9.5 6.5 11Z" opacity="0.5"/>

                    {/* Bottom Bowl */}
                    <path d="M6.5 14.5H17.5C17.5 14.5 17.5 16.5 12 16.5C6.5 16.5 6.5 14.5 6.5 14.5Z" />
                    <path d="M6.5 14.5C6.5 16 8.5 16.5 12 16.5C15.5 16.5 17.5 16 17.5 14.5C17.5 13 15.5 12.5 12 12.5C8.5 12.5 6.5 13 6.5 14.5Z" opacity="0.5"/>
                  </g>
                </svg>
              </div>
              <span className="font-black text-xl tracking-tight text-gray-900 hidden sm:block">
                Cuisine<span className="text-yellow-400">Courier</span>
              </span>
            </button>

            {/* 2. Desktop Links */}
            <div className="hidden md:flex items-center space-x-6"> {/* FIXED: Increased spacing */}
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={link.action}
                  className={`
                    relative px-3 py-2 text-sm font-semibold tracking-wide transition-all duration-300 rounded-lg
                    ${currentView === link.id 
                      ? 'text-gray-900 bg-yellow-50' 
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  {link.label}
                  {currentView === link.id && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* 3. Auth Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center pl-4 border-l border-gray-200">
                  <div className="flex items-center space-x-3 mr-4">
                    <div className="w-9 h-9 rounded-full bg-yellow-100 text-yellow-600 border border-yellow-200 flex items-center justify-center">
                      <UserIcon size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400 font-medium">Welcome back,</span>
                      <span className="text-sm font-bold text-gray-900 leading-none">{user.name.split(' ')[0]}</span>
                    </div>
                  </div>
                  <button 
                    onClick={onLogout}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Logout"
                  >
                    <LogOut size={20} strokeWidth={2} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={onGetStarted}
                  className="group relative px-6 py-2.5 bg-gray-900 text-white rounded-full font-bold text-sm overflow-hidden shadow-lg hover:shadow-yellow-400/40 hover:scale-105 transition-all duration-300"
                >
                  <span className="relative z-10 group-hover:text-gray-900 transition-colors duration-300">Get Started</span> {/* FIXED: Text turns dark on yellow hover */}
                  <div className="absolute inset-0 bg-yellow-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out" />
                </button>
              )}
            </div>

            {/* 4. Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* 5. Mobile Menu Dropdown */}
        <div className={`
          md:hidden bg-white/95 backdrop-blur-xl border-b border-gray-100 overflow-hidden transition-all duration-300 ease-in-left
          ${isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
        `}>
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col space-y-2"> {/* FIXED: Aligned px-6 */}
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  link.action();
                  setIsMobileMenuOpen(false);
                }}
                className={`
                  flex items-center justify-between p-3 rounded-lg text-sm font-bold transition-colors text-left
                  ${currentView === link.id 
                    ? 'bg-yellow-50 text-gray-900' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <span>{link.label}</span>
                {currentView === link.id && <ChevronDown size={16} className="rotate-[-90deg]" />}
              </button>
            ))}

            <div className="pt-6 mt-2 border-t border-gray-100 flex flex-col space-y-3">
              {user ? (
                <button 
                  onClick={() => {
                    onLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-lg border border-red-100 text-red-500 font-bold bg-red-50/50 hover:bg-red-50 transition-all"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              ) : (
                <button 
                  onClick={() => {
                    onGetStarted();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-yellow-400 text-gray-900 py-3.5 rounded-lg font-bold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
                >
                  Get Started Free
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer: Prevents content from hiding behind the fixed header (h-24) */}
      <div className="h-24 w-full bg-white/90"></div> 
    </>
  );
};

export default Navbar;