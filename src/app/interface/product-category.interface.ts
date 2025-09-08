

export interface ProductCategory {
  createdBy: string;
  updatedBy: string;
  dateCreated: string; // ISO date string
  lastUpdated: string; // ISO date string
  id: number;
  name: string;
  categories: ProductCategory[]; // Array of Umo
}
