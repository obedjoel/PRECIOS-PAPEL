export interface AppProduct {
  id: string;
  category: string;
  name: string;
  unit: string;
  price: number;
  unitPrice: number | null;
  grammage?: string | null;
  size?: string | null;
  brand?: string | null;
}

export interface ProductSelection {
  qty: number;
  menudeo: number;
}
