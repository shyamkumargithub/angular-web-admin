import { StockLocation } from "./stock-location.interface";
import { StockMove } from "./stock-move.interface";

export interface StockPicking {
  id: number;
  name: string;
  origin: string;
  pickingType: string;
  state: string;
  scheduledDate: string;
  dateDone: string | null;
  deliveryNote: string | null;
  proofOfDelivery: string | null;
  purchaseOrderId: number;
  purchaseOrderName: string;
  locationSource: StockLocation;
  locationDestination: StockLocation;
  moves: StockMove[];
}
