import { StockLocation } from "./stock-location.interface";

export interface StockMove {
  id: number;
  name: string;
  productId: number;
  productName: string;
  productUomQty: number;
  quantityDone: number;
  state: string;
  locationSource: StockLocation;
  locationDestination: StockLocation;
  expectedDate: string;
}
