import type { AdStatus } from "../../types/database.types";

export interface Category {
  id: number;
  name: string;
  value: string;
  icon: string;
}

export interface AdSeller {
  id: string;
  name: string;
  phone: string;
}

export interface Product {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: Category;
  user: AdSeller;
  image?: string;
  price: string;
  created_at: string;
  status: AdStatus;
  city: string;
  ostan: string;
}

export interface AdsResponse {
  data: Product[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface AdsFilters {
  category?: string;
  search?: string;
  price_from?: string;
  price_to?: string;
  sort?: string;
  page?: string | number;
  ostan?: string;
}

export interface CreateAdInput {
  categoryId: number;
  cityId: number;
  description: string;
  images: File[];
  price: number | null;
  provinceId: number;
  title: string;
}

export interface UpdateAdInput {
  category_id?: number;
  city_id?: number;
  description?: string;
  price?: number | null;
  province_id?: number;
  title?: string;
}
