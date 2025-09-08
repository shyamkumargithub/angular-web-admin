export interface ProductVariant {
  attributeValues: string[];
  barcode: string;
  categoryId: number;
  categoryName: string;
  defaultCode: string;
  id: number;
  templateId: number;
  templateName: string;
}

export interface Product {
  attributes: string[];
  category: string;
  id: number;
  name: string;
  purchaseUom: string;
  saleUom: string;
  stockUom: string;
  tracking: "NONE" | string;
  type: "PRODUCT" | string;
  variant: boolean;
  variants: ProductVariant[];
}
