import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface FilePreviewData {
  title: string;
  fileUrl: string;
  fileType: 'image' | 'video' | 'audio';
}


@Component({
  selector: 'CoreLab-view-music-dailog',
  templateUrl: './view-music-dailog.component.html',
  styleUrls: ['./view-music-dailog.component.scss']
})
export class ViewMusicDailogComponent {
  imageLoaded = false;
  videoLoaded = false;
  audioLoaded = false;
   constructor(
      public dialogRef: MatDialogRef<ViewMusicDailogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: FilePreviewData
    ) {}
  
    close(): void {
      this.dialogRef.close();
    }
}
