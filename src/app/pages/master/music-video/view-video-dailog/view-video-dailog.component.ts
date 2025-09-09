import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface FilePreviewData {
  title: string;
  fileUrl: string;
  fileType: 'image' | 'video' | 'audio';
}

@Component({
  selector: 'CoreLab-view-video-dailog',
  templateUrl: './view-video-dailog.component.html',
  styleUrls: ['./view-video-dailog.component.scss']
})
export class ViewVideoDailogComponent {
    imageLoaded = false;
  videoLoaded = false;
  audioLoaded = false;
   constructor(
      public dialogRef: MatDialogRef<ViewVideoDailogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: FilePreviewData
    ) {}
  
    close(): void {
      this.dialogRef.close();
    }
  
}
