import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface FilePreviewData {
  title: string;
  thumbnail?: string;
  fileUrl: string;
  fileType: 'image' | 'video' | 'audio';
}


@Component({
  selector: 'CoreLab-file-preview-dialog',
  templateUrl: './file-preview-dialog.component.html',
  styleUrls: ['./file-preview-dialog.component.scss']
})
export class FilePreviewDialogComponent {
 constructor(
    public dialogRef: MatDialogRef<FilePreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FilePreviewData
  ) {}

  close(): void {
    this.dialogRef.close();
  }

}
