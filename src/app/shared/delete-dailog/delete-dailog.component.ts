import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ModalData } from 'src/app/interface/DeleteModalData';
@Component({
  selector: "CoreLab-delete-dailog",
  templateUrl: "./delete-dailog.component.html",
  styleUrls: ["./delete-dailog.component.scss"],
})
export class DeleteDailogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteDailogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalData
  ) {}

  onClose(result: boolean): void {
    this.dialogRef.close(result);
  }
}
