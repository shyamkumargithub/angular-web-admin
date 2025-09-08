export interface AttributeValues {
  createdBy: string;
  updatedBy: string;
  dateCreated: string; // ISO date string
  lastUpdated: string; // ISO date string
  id: number;
  name: string;
  

}

export interface Attribute {
  createdBy: string;
  updatedBy: string;
  dateCreated: string; // ISO date string
  lastUpdated: string; // ISO date string
  id: number;
  name: string;
  attributeValues: AttributeValues[]; // Array of Umo
}
