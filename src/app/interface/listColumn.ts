import { TemplateRef } from "@angular/core";

 export interface ListColumn {
   name: string;
   property: string;
   visible: boolean;
   headerTemplate?: TemplateRef<unknown>;
   cellTemplate?: TemplateRef<unknown>;
   valuePath?: string;
    alwaysShow?: boolean; //not allowed to be hidden
 }