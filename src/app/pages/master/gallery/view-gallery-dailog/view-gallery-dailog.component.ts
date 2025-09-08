import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface FilePreviewData {
  title: string;
  fileUrl: string;
  fileType: 'image' | 'video' | 'audio';
}

@Component({
  selector: 'CoreLab-view-gallery-dailog',
  templateUrl: './view-gallery-dailog.component.html',
  styleUrls: ['./view-gallery-dailog.component.scss']
})
export class ViewGalleryDailogComponent {
    imageLoaded = false;
  videoLoaded = false;
  audioLoaded = false;
   constructor(
      public dialogRef: MatDialogRef<ViewGalleryDailogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: FilePreviewData
    ) {}
  
    close(): void {
      this.dialogRef.close();
    }
  
}
