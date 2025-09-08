

export interface StockLocation {
  createdBy: string;
  updatedBy: string;
  dateCreated: string; // ISO date string
  lastUpdated: string; // ISO date string
  id: number;
  name: string;
  description: string;
  code: string;
  locationType: "VENDOR" | "CUSTOMER"|"INTERNAL" | "TRANSIT" | "INVENTORY" | "PRODUCTION" | "PROCUREMENT";
  usageArea: string; // e.g., "Pharmacy", "Laboratory"
  locations: StockLocation[]; // Array of Umo
}


