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


import { ManageGalleryDialogComponent } from "./manage-gallery-dialog/manage-gallery-dialog.component";
import { Media } from "src/app/interface/Media";
import { environment } from "src/environments/environment";
import { ViewGalleryDailogComponent } from "./view-gallery-dailog/view-gallery-dailog.component";

@Component({
  selector: 'CoreLab-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent {
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
      { name: "Caption", property: "caption", visible: true, alwaysShow: true,valuePath:'imageMetadata.caption' },
      { name: "Category", property: "category", visible: true, alwaysShow: true,valuePath:'imageMetadata.category' },
     
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
      category: [""],
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
      fileTypes:'IMAGE'
    };

    if (
      this.form.get("key")?.value != undefined &&
      this.form.get("key")?.value != ""
    ) {
      params.key = this.form.get("key")?.value;
    }
       if (
      this.form.get("category")?.value != undefined &&
      this.form.get("category")?.value != ""
    ) {
      params.categories = this.form.get("category")?.value;
    }
   

  
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
    const dialogRef = this.dialog.open(ManageGalleryDialogComponent, {
      data: { action: "CREATE", title: "Gallery Management", payload: null },
      width: "600px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined && result != "") {
        this.getAllMedia();
      }
    });
  }

  openUpdateDialog(row: Category) {
    const dialogRef = this.dialog.open(ManageGalleryDialogComponent, {
      data: { action: "UPDATE", title: "Gallery Management", payload: row },
      width: "600px",
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
         
          row.imageMetadata.caption,
        confirmText: "Yes",
        cancelText: "No",
      } as ModalData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined && result != "") {
        this.masterService.deleteMedia(row.id).subscribe({
          next: (data) => {
            this._snackBar.open("Media deleted successfully.", "Close", {
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
  const fileData: any = {
    title: row?.imageMetadata?.caption,
    fileUrl: this.baseUrl+row?.url,
    fileType: 'image'
  };

  this.dialog.open(ViewGalleryDailogComponent, {
    data: fileData,
    width: '600px',
    panelClass: 'custom-dialog-container'
  });
}
}
