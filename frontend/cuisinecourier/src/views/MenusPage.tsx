import React, { useState } from 'react';
import { Search, Filter, Download, Leaf, Globe, Star, Calendar, ChefHat } from 'lucide-react';

interface MenusPageProps {}

const MenusPage: React.FC<MenusPageProps> = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['all', 'appetizer', 'main', 'dessert', 'beverage'];
  const dietaryOptions = [
    { id: 'vegetarian', label: 'Vegetarian', icon: <Leaf className="w-4 h-4" /> },
    { id: 'vegan', label: 'Vegan', icon: <Leaf className="w-4 h-4" /> },
    { id: 'gluten-free', label: 'Gluten Free', icon: <Globe className="w-4 h-4" /> },
  ];

  const menuItems = [
    {
      id: 1,
      name: 'Wild Mushroom Risotto',
      category: 'main',
      description: 'Creamy arborio rice with wild mushrooms, truffle oil, and parmesan crisp',
      cuisine: 'Italian',
      dietary: ['vegetarian', 'gluten-free'],
      tierAccess: ['GOLD', 'DIAMOND'],
      seasonal: true,
      image: '/2.png'
    },
    {
      id: 2,
      name: 'Grilled Sea Bass',
      category: 'main',
      description: 'Mediterranean sea bass with herb crust, roasted vegetables, lemon butter sauce',
      cuisine: 'Mediterranean',
      dietary: ['gluten-free'],
      tierAccess: ['GOLD', 'DIAMOND'],
      seasonal: false,
      image: '/3.png'
    },
    {
      id: 3,
      name: 'Beef Wellington',
      category: 'main',
      description: 'Classic beef tenderloin wrapped in puff pastry with mushroom duxelles',
      cuisine: 'British',
      dietary: [],
      tierAccess: ['DIAMOND'],
      seasonal: false,
      image: '/1.png'
    },
    {
      id: 4,
      name: 'Truffle Fries',
      category: 'appetizer',
      description: 'Crispy fries with truffle oil, parmesan, and fresh herbs',
      cuisine: 'American',
      dietary: ['vegetarian'],
      tierAccess: ['SILVER', 'GOLD', 'DIAMOND'],
      seasonal: false,
      image: '/4.png'
    },
    {
      id: 5,
      name: 'Chocolate Lava Cake',
      category: 'dessert',
      description: 'Warm chocolate cake with molten center, vanilla ice cream',
      cuisine: 'French',
      dietary: ['vegetarian'],
      tierAccess: ['SILVER', 'GOLD', 'DIAMOND'],
      seasonal: false,
      image: '/5.png'
    },
    {
      id: 6,
      name: 'Vegan Buddha Bowl',
      category: 'main',
      description: 'Quinoa, roasted chickpeas, avocado, tahini dressing, fresh greens',
      cuisine: 'Modern',
      dietary: ['vegan', 'gluten-free'],
      tierAccess: ['GOLD', 'DIAMOND'],
      seasonal: true,
      image: '/6.png'
    }
  ];

  const filteredItems = menuItems.filter(item => {
    if (activeFilter !== 'all' && item.category !== activeFilter) return false;
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-brand-white font-sans pb-20">
      {/* Header */}
      <header className="bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100 pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-orange-600 font-bold uppercase tracking-widest text-sm mb-2 block">Culinary Excellence</span>
          <h1 className="text-4xl md:text-6xl font-black text-black mb-4">Our Menus</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Discover our curated selection of dishes, crafted with the finest ingredients and inspired by global cuisines.
          </p>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="sticky top-24 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text"
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
              />
            </div>
            
            {/* Category Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-bold tracking-tight transition-all whitespace-nowrap Rwf{
                    activeFilter === cat 
                      ? 'bg-brand-black text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-yellow-100'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}s
                </button>
              ))}
            </div>

            <button className="px-4 py-2 border border-gray-200 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-gray-50">
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>

          {/* Dietary Filters */}
          <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
            {dietaryOptions.map(option => (
              <button
                key={option.id}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-sm hover:bg-green-50 transition-colors"
              >
                {option.icon}
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chef's Special */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-64 h-64 rounded-2xl overflow-hidden shadow-xl">
              <img src="/2.png" alt="Chef's Special" className="w-full h-full object-cover" />
            </div>
            <div className="flex-grow text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-white font-bold text-sm mb-4">
                <ChefHat className="w-4 h-4" /> Chef's Special
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Wild Mushroom Risotto</h2>
              <p className="text-white/90 text-lg mb-6">
                Our signature dish featuring creamy arborio rice, wild forest mushrooms, truffle oil, and a crispy parmesan crisp.
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-white/80 mb-6">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Seasonal</span>
                <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> Italian</span>
                <span className="flex items-center gap-1"><Leaf className="w-4 h-4" /> Vegetarian</span>
              </div>
              <span className="inline-block bg-white text-black px-6 py-3 rounded-xl font-bold">
                Available in Gold & Diamond packages
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Items Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-8">All Dishes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group">
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {item.seasonal && (
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    Seasonal
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold text-white Rwf{
                    item.tierAccess.includes('DIAMOND') ? 'bg-purple-500' :
                    item.tierAccess.includes('GOLD') ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}>
                    {item.tierAccess.join('/')}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase text-yellow-600">{item.cuisine}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs font-bold uppercase text-gray-500">{item.category}</span>
                </div>
                
                <h3 className="text-xl font-bold text-brand-black mb-2">{item.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{item.description}</p>
                
                <div className="flex items-center gap-2 mb-4">
                  {item.dietary.map((diet, i) => (
                    <span key={i} className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">
                      {diet}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1 text-yellow-500">
                    {[1,2,3,4,5].map(star => (
                      <Star key={star} size={14} fill="currentColor" className={star <= 5 ? '' : 'opacity-30'} />
                    ))}
                  </div>
                  <button className="text-yellow-600 font-bold text-sm hover:text-black transition-colors">
                    Add to Menu
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Download Menu CTA */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-brand-black rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Download Our Full Menu</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Get our complete menu catalog with detailed descriptions, dietary information, and pricing for all service tiers.
          </p>
          <button className="bg-yellow-500 text-black px-8 py-4 rounded-xl text-lg font-bold hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 mx-auto">
            <Download className="w-5 h-5" /> Download PDF Menu
          </button>
        </div>
      </section>

      {/* Menu Tasting CTA */}
      <section className="py-16 px-6 bg-yellow-50">
        <div className="max-w-4xl mx-auto text-center">
          <ChefHat className="w-16 h-16 mx-auto mb-6 text-yellow-600" />
          <h2 className="text-3xl md:text-4xl font-black text-brand-black mb-4">Book a Menu Tasting</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Experience our culinary offerings firsthand. Schedule a tasting session with our executive chef.
          </p>
          <button className="bg-brand-black text-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-gray-800 transition-colors">
            Schedule Tasting
          </button>
        </div>
      </section>
    </div>
  );
};

export default MenusPage;
