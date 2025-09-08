 export interface OrderLine {
  id: number;
  priceUnit: number;
  productId: number;
  quantity: number;
  taxPercent: number;
  uomId: number;
}

export interface PurchaseOrder {
  id?:number
  dateOrder: string; // ISO date string
  orderLines: OrderLine[];
  partner: number;
}
