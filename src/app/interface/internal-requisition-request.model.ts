import { InternalRequisitionLine } from "./internal-requisition-line.model";

export interface InternalRequisitionRequest {
  locationSourceId: number;
  locationDestId: number;
  lines: InternalRequisitionLine[];
}
