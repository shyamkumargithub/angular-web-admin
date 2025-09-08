export interface Umo {
  createdBy: string;
  updatedBy: string;
  dateCreated: string; // ISO date string
  lastUpdated: string; // ISO date string
  id: number;
  name: string;
  description: string | null;
  category: number;

  type: "REFERENCE" | "SMALLER" | "BIGGER"; // string literal union based on data
  factor: number;
}

export interface Category {
  createdBy: string;
  updatedBy: string;
  dateCreated: string; // ISO date string
  lastUpdated: string; // ISO date string
  id: number;
  name: string;

  uoms: Umo[]; // Array of Umo
}
