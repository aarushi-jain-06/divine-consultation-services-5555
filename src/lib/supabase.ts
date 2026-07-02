import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ProductCategory =
  | 'crystals'
  | 'numerology'
  | 'consultation'
  | 'rudraksh'
  | 'vastu'
  | 'matchmaking'
  | 'healings'
  | 'horoscope'
  | 'visiting_card'
  | 'name_design'
  | 'ubtan'
  | 'bath_salts';

export type ProductType = 'service' | 'product';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number | null;
  image_url: string | null;
  category: ProductCategory;
  type: ProductType;
  sort_order: number;
  created_at: string;
};

export type Contact = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

export type Testimonial = {
  id: string;
  name: string;
  review: string;
  rating: number;
  approved: boolean;
  created_at: string;
};

export type AboutUs = {
  id: string;
  content: string;
  updated_at: string;
};
