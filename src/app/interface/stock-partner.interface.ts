export interface StockPartner {
  id:number;
  /** The name of the distributor/organization */
  name: string;

  /** Contact email address */
  email: string;

  /** Contact phone number with country code */
  phone: string;

  /**
   * Type of business relationship
   * - SUPPLIER: Provides products/services
   * - CUSTOMER: Purchases products/services
   * - BOTH: Both supplier and customer
   */
  partnerType: "SUPPLIER" | "CUSTOMER" | "BOTH";

  /** Street address */
  street: string;

  /** City */
  city: string;

  /** State/Province */
  state: string;

  /** ZIP/Postal code */
  zip: number;

  /** Country */
  country: string;
}
