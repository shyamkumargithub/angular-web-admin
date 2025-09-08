
import { AudioMetadata } from "./Media";

export interface Quiz {
  id?: string;
  text: string;
  category:string;
  options: string[];
  correctOptionIndex: number;
   audio?: AudioMetadata|null;
}

