import { FormBuilder, FormGroup } from "@angular/forms";

import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Category } from "src/app/interface/category.interface";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MasterService } from "../master.service";
import { ListColumn } from "src/app/interface/listColumn";
import { debounceTime } from "rxjs";
import { DeleteDailogComponent } from "src/app/shared/delete-dailog/delete-dailog.component";
import { ModalData } from "src/app/interface/DeleteModalData";



import { Media } from "src/app/interface/Media";
import { environment } from "src/environments/environment";
import { ManageMusicComponent } from "./manage-music/manage-music.component";
import { ViewMusicDailogComponent } from "./view-music-dailog/view-music-dailog.component";

@Component({
  selector: 'CoreLab-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.scss']
})
export class MusicComponent {
   baseUrl = environment.server;
  @ViewChild("actionsTemplate", { static: true })
  actionsTemplate!: TemplateRef<any>;
  @ViewChild("firstPosTemplate", { static: true })
  firstPosTemplate!: TemplateRef<any>;

  @ViewChild("imageTemplate", { static: true })
  imageTemplate!: TemplateRef<any>;

  columns: ListColumn[] = [];
  displayedColumns: ListColumn[] = [];

  page: Number = 0;
  size: Number = 10;

  pageSizeList: any[] = [10, 25, 50, 100, 250];
  recordCount: number;

  mediaList: Media[] = [];
  form: FormGroup;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private fb: FormBuilder,
    private masterService: MasterService,
    private _snackBar: MatSnackBar,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.columns = [
      
      { name: "#", property: "pos", visible: true, alwaysShow: true },
       { name: "Image", property: "image", visible: true, alwaysShow: true },
      { name: "Title", property: "title", visible: true, alwaysShow: true,valuePath:'audioMetadata.title' },

      { name: "Genre", property: "genre", visible: true, alwaysShow: true,valuePath:'audioMetadata.genre' },
      { name: "Language", property: "language", visible: true, alwaysShow: true,valuePath:'audioMetadata.language' },
      { name: "Year", property: "year", visible: true, alwaysShow: true,valuePath:'audioMetadata.year' },
        { name: "Artist", property: "artist", visible: true, alwaysShow: true,valuePath:'audioMetadata.artist' },
     
      {
        name: "Actions",
        property: "actions",
        visible: true,
        alwaysShow: true,
      },
    ];
    this.displayedColumns = this.columns;

    this.form = this.fb.group({
      key: [""],
      status: ["true"],

      fromDate: [""],
      toDate: [""],
    });

    this.form.valueChanges
      .pipe(debounceTime(400))
      .subscribe((selectedValue) => {
        this.getAllMedia();
      });
    this.getAllMedia();
  }

  onPageChange(event: { pageIndex: number; pageSize: number }) {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.getAllMedia();
  }

  getAllMedia() {
    let params: any = {
      page: this.page,
      size: this.size,
      sort: "id,asc",
      fileTypes:"AUDIO"
    };

    // if (
    //   this.form.get("key")?.value != undefined &&
    //   this.form.get("key")?.value != ""
    // ) {
    //   params.key = this.form.get("key")?.value;
    // }

  
    this.masterService.getAllMedia(params).subscribe({
      next: (data) => {
    
        this.recordCount = data.totalElements;
        this.mediaList = data.content;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  ngOnChanges() {
  
    this.updateDisplayedColumns();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const templatesMap: { [key: string]: TemplateRef<any> } = {
        actions: this.actionsTemplate,
        pos: this.firstPosTemplate,
        image: this.imageTemplate,
      };

      this.columns.forEach((column) => {
        const template = templatesMap[column.property];
        if (template) {
          column.cellTemplate = template;
        }
      });

      this.cdRef.detectChanges();
    });
  }

  clear() {
    this.form.reset();
    this.form.get("status")?.setValue("Active");
  }

  updateDisplayedColumns() {
    this.displayedColumns = this.columns.filter((col) => col.visible);
  }

  toggleColumnVisibility(column: any) {
    column.visible = !column.visible;
    this.updateDisplayedColumns();
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(ManageMusicComponent, {
      data: { action: "CREATE", title: "Music Management", payload: null },
      width: "800px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined && result != "") {
        this.getAllMedia();
      }
    });
  }

  openUpdateDialog(row: Category) {
    const dialogRef = this.dialog.open(ManageMusicComponent, {
      data: { action: "UPDATE", title: "Music Management", payload: row },
      width: "800px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined && result != "") {
        this.getAllMedia();
      }
    });
  }

  delete(row: Media) {
    console.log("delete row", row);
    const dialogRef = this.dialog.open(DeleteDailogComponent, {
      width: "400px",
      data: {
        title: "Confirm Delete" ,
        body:
          "Are you sure you want to Delete" +
         
          row?.audioMetadata?.title,
        confirmText: "Yes",
        cancelText: "No",
      } as ModalData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined && result != "") {
        this.masterService.deleteMedia(row.id).subscribe({
          next: (data) => {
            this._snackBar.open("Mussic deleted successfully.", "Close", {
              duration: 5000,
            });
            this.getAllMedia();
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
    });
  }

   openPreview(row: Media) {
    //console.log(">>>>>>>>>seleted media",row)
    const fileData: any = {
      title: row?.audioMetadata?.title,
      fileUrl: this.baseUrl+row?.url,
      fileType: 'audio'
    };
  
    this.dialog.open(ViewMusicDailogComponent, {
      data: fileData,
      width: '600px',
      panelClass: 'custom-dialog-container'
    });
  }
}
