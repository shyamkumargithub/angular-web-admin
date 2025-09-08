import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Actor, MediaFile } from 'src/app/interface/Actor';
import { environment } from 'src/environments/environment';

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
    @Inject(MAT_DIALOG_DATA) public data: Actor
  ) { }

  ngOnInit(): void {
    console.log(">>>>>>>>>view On init",this.data)
     this.images = this.getMediaByType('IMAGE');
    this.videos = this.getMediaByType('VIDEO');
  }

  onClose(): void {
    this.dialogRef.close();
  }

  trackByMediaId(index: number, item: any): number {
    return item.id;
  }
 
  getMediaByType(type: 'IMAGE' | 'VIDEO'): MediaFile[] {
    return this.data.galleries ? 
      this.data.galleries.filter(item => item.fileType === type) : [];
  }
}
