export type UserRole = 'CLIENT' | 'PROVIDER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  business_name?: string;
  phone?: string;
}

export interface CateringService {
  id: string;
  providerId: string;
  providerName: string;
  title: string;
  description: string;
  pricePerPerson: number;
  category: 'Wedding' | 'Corporate Events' | 'Birthday Parties' | 'Dinner Parties';
  rating: number;
  image_url: string;
  features: string[];
  // Service Tier fields
  tier?: 'SILVER' | 'GOLD' | 'DIAMOND';
  minGuests?: number;
  maxGuests?: number;
  inclusions?: string[];
  equipmentProvided?: string[];
  staffRatio?: string;
}

export interface ServiceTier {
  id: string;
  name: 'SILVER' | 'GOLD' | 'DIAMOND';
  displayName: string;
  description: string;
  minPrice: number;
  maxPrice: number;
  minGuests: number;
  maxGuests: number;
  inclusions: string[];
  equipment: string[];
  staffRatio: string;
  amenities: string[];
}

export interface Booking {
  id: string;
  serviceId: string;
  serviceTitle: string;
  clientId: string;
  clientName: string;
  date: string;
  guestCount: number;
  status: 'pending' | 'confirmed' | 'preparation' | 'completed' | 'cancelled';
  totalAmount: number;
  notes?: string;
  paymentStatus?: 'pending' | 'partial' | 'paid';
  location?: string;
  teamLeadId?: string;
}

export interface MenuSuggestion {
  name: string;
  items: string[];
  theme: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: 'appetizer' | 'main' | 'dessert' | 'beverage' | 'snack';
  cuisine: string;
  dietary: ('vegetarian' | 'vegan' | 'gluten-free' | 'halal' | 'kosher')[];
  seasonal: boolean;
  tierAccess: ('SILVER' | 'GOLD' | 'DIAMOND')[];
  imageUrl?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  eventType: string;
  tier: string;
  date: string;
  location: string;
  guestCount: number;
  images: string[];
  teamLead: string;
  clientName: string;
  rating?: number;
  testimonial?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatarUrl: string;
  specialties: string[];
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  condition: string;
  location: string;
  minStockAlert: number;
  isAvailable: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'assignment' | 'inventory' | 'system';
  isRead: boolean;
  createdAt: string;
}
