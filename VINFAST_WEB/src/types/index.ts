export type Role = 'customer' | 'staff';

export type VehicleCategory = 'suv' | 'scooter';
export type FilterCategory = 'all' | 'suv' | 'scooter';

export interface Vehicle {
  id: string;
  name: string;
  tagline: string;
  category: VehicleCategory;
  image: string;
  heroImage?: string;
  basePrice: number;
  range: number;
  battery: string;
  acceleration: string;
  topSpeed: number;
  seats: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  colors: string[];
  description: string;
  highlights: string[];
}

export interface Quote {
  id: string;
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  vehicle_id: string;
  vehicle_name: string;
  base_price: number;
  discount: number;
  final_price: number;
  ai_summary?: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export type ChatStage =
  | 'greeting'
  | 'asking_budget'
  | 'asking_usage'
  | 'recommendation'
  | 'asking_quote'
  | 'collecting_name'
  | 'collecting_phone'
  | 'quote_saved'
  | 'free';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  avatar?: string;
  employeeId?: string;
  showroom?: string;
  position?: string;
  memberLevel?: 'Standard' | 'Gold' | 'Platinum' | 'VIP';
}

