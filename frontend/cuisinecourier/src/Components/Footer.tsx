import React from 'react';
import { Instagram, Twitter, Facebook, Mail, MapPin, Phone } from 'lucide-react';

interface FooterProps {
  onBrandClick: () => void;
  onServicesClick?: () => void;
  onGalleryClick?: () => void;
  onAboutClick?: () => void;
  onDashboardClick?: () => void;
}

const Footer: React.FC<FooterProps> = ({ 
  onBrandClick, 
  onServicesClick = () => {},
  onGalleryClick = () => {},
  onAboutClick = () => {},
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white pt-24 pb-12 border-t-4 border-yellow-400 relative overflow-hidden">
      
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-yellow-400 rounded-full opacity-5 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Top Section: Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* 1. Brand Column */}
          <div className="space-y-6">
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
                  <path d="M12 2L21 6.5V17.5L12 22L3 17.5V6.5L12 2Z" />
                  <g fill="white">
                    <path d="M6.5 7.5H17.5C17.5 7.5 17.5 9.5 12 9.5C6.5 9.5 6.5 7.5 6.5 7.5Z" />
                    <path d="M6.5 7.5C6.5 9 8.5 9.5 12 9.5C15.5 9.5 17.5 9 17.5 7.5C17.5 6 15.5 5.5 12 5.5C8.5 5.5 6.5 6 6.5 7.5Z" opacity="0.5"/>
                    <path d="M6.5 11H17.5C17.5 11 17.5 13 12 13C6.5 13 6.5 11 6.5 11Z" />
                    <path d="M6.5 11C6.5 12.5 8.5 13 12 13C15.5 13 17.5 12.5 17.5 11C17.5 9.5 15.5 9 12 9C8.5 9 6.5 9.5 6.5 11Z" opacity="0.5"/>
                    <path d="M6.5 14.5H17.5C17.5 14.5 17.5 16.5 12 16.5C6.5 16.5 6.5 14.5 6.5 14.5Z" />
                    <path d="M6.5 14.5C6.5 16 8.5 16.5 12 16.5C15.5 16.5 17.5 16 17.5 14.5C17.5 13 15.5 12.5 12 12.5C8.5 12.5 6.5 13 6.5 14.5Z" opacity="0.5"/>
                  </g>
                </svg>
              </div>
              <span className="font-black text-xl tracking-tight text-white hidden sm:block">
                Cuisine<span className="text-yellow-400">Courier</span>
              </span>
            </button>
            
            <p className="text-gray-400 leading-relaxed text-sm">
              Crafting culinary experiences that elevate your events. From intimate gatherings to grand weddings, we serve excellence on every plate.
            </p>
            
            <div className="flex space-x-4">
              {[
                { icon: <Instagram size={20} />, label: 'Instagram' },
                { icon: <Twitter size={20} />, label: 'Twitter' },
                { icon: <Facebook size={20} />, label: 'Facebook' },
              ].map((social, idx) => (
                <a 
                  key={idx} 
                  href="https://www.instagram.com/cuisinecouriers/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center border border-gray-800 text-gray-400 hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* 2. Quick Links Column */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-white tracking-wide">Explore</h3>
            <ul className="space-y-4">
              {[
                { label: 'Home', onClick: onBrandClick },
                { label: 'Services', onClick: onServicesClick },
                { label: 'Gallery', onClick: onGalleryClick },
                { label: 'About Us', onClick: onAboutClick },
              ].map((link) => (
                <li key={link.label}>
                  <button 
                    onClick={link.onClick}
                    className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 text-sm font-medium flex items-center group w-full text-left bg-transparent border-none cursor-pointer"
                  >
                    <span className="w-0 h-[1px] bg-yellow-400 mr-2 transition-all duration-300 group-hover:w-4"></span>
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Contact Column */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-white tracking-wide">Contact</h3>
            <ul className="space-y-5">
              <li className="flex items-start space-x-3 text-sm text-gray-400">
                <MapPin size={18} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                <span>Cuisine Courier Restaurant<br/>Kigali, Rwanda</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-gray-400">
                <Phone size={18} className="text-yellow-400 flex-shrink-0" />
                <a href="tel:0789903010" className="group cursor-pointer transition-colors group-hover:text-yellow-400">
                  0789903010 / 0781633737
                </a>
              </li>
              <li className="flex items-center space-x-3 text-sm text-gray-400">
                <Mail size={18} className="text-yellow-400 flex-shrink-0" />
                <a href="mailto:cuisinecourier2022@gmail.com" className="group cursor-pointer transition-colors group-hover:text-yellow-400">
                  cuisinecourier2022@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* 4. Newsletter Column */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-white tracking-wide">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-5">Subscribe to our newsletter for exclusive menus and seasonal offers.</p>
            <form onSubmit={(e) => e.preventDefault()} className="relative">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full bg-gray-900 border border-gray-800 text-white px-4 py-3.5 rounded-lg focus:outline-none focus:border-yellow-400 transition-colors text-sm placeholder-gray-600"
                required
              />
              <button 
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 bg-yellow-400 text-black px-5 rounded-md font-bold text-xs hover:bg-white transition-colors uppercase tracking-wider"
              >
                Join
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Section: Copyright */}
        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>
            &copy; {currentYear} Cuisine Courier. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0 font-medium">
            <a href="#" className="hover:text-yellow-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-yellow-400 transition-colors">Terms of Service</a>
          </div>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;