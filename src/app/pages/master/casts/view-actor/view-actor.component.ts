import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Actor, MediaFile } from 'src/app/interface/Actor';
import { environment } from 'src/environments/environment';
import { MasterService } from '../../master.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'CoreLab-view-actor',
  templateUrl: './view-actor.component.html',
  styleUrls: ['./view-actor.component.scss']
})
export class ViewActorComponent implements OnInit{
  baseUrl=environment.server
   images: MediaFile[] = [];
  videos: MediaFile[] = [];
 constructor(
    public dialogRef: MatDialogRef<ViewActorComponent>,
    private masterService:MasterService,
     private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: Actor
  ) { }

  ngOnInit(): void {
   
     this.images = this.getMediaByType('IMAGE_ACTOR');
    this.videos = this.getMediaByType('VIDEO_ACTOR');
  }

  onClose(): void {
    this.dialogRef.close();
  }

  trackByMediaId(index: number, item: any): number {
    return item.id;
  }
 
  getMediaByType(type: 'VIDEO_ACTOR' | 'IMAGE_ACTOR'): MediaFile[] {
    return this.data.galleries ? 
      this.data.galleries.filter(item => item.fileType === type) : [];
  }

  onClickDelete(id){
    this.masterService.deleteActorMediaGallery(id).subscribe({
    next: () => {
      // Remove from data payload
      if (this.data.galleries) {
        this.data.galleries = this.data.galleries.filter(item => item.id !== id);
      }

      // Refresh local arrays
      this.images = this.getMediaByType('IMAGE_ACTOR');
      this.videos = this.getMediaByType('VIDEO_ACTOR');

      this._snackBar.open("Media deleted successfully.", "Close", {
        duration: 5000,
      });
    },
    error: (error) => {
      console.log(error);
      this._snackBar.open(error.error.message, "Close", {
        duration: 5000,
        panelClass: ["style-error"],
      });
    },
  });
  }
}
