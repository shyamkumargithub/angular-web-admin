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

import { Attribute } from "src/app/interface/attribute.interface";
import { Actor } from "src/app/interface/Actor";
import { CastFormData, ManageCastsComponent } from "./manage-casts/manage-casts.component";
import { environment } from "src/environments/environment";
import { ViewActorComponent } from "./view-actor/view-actor.component";
import { UploadMediaComponent } from "./upload-media/upload-media.component";

@Component({
  selector: 'CoreLab-casts',
  templateUrl: './casts.component.html',
  styleUrls: ['./casts.component.scss']
})
export class CastsComponent {

   baseUrl = environment.server;
  @ViewChild("actionsTemplate", { static: true })
  actionsTemplate!: TemplateRef<any>;
  @ViewChild("firstPosTemplate", { static: true })
  firstPosTemplate!: TemplateRef<any>;
   @ViewChild("profileTemplate", { static: true })
  profileTemplate!: TemplateRef<any>;
  @ViewChild("aboutTemplate", { static: true })
  aboutTemplate!: TemplateRef<any>;
   @ViewChild("imageCountTemplate", { static: true })
  imageCountTemplate!: TemplateRef<any>;
  @ViewChild("videoCountTemplate", { static: true })
  videoCountTemplate!: TemplateRef<any>;

  columns: ListColumn[] = [];
  displayedColumns: ListColumn[] = [];

  page: Number = 0;
  size: Number = 10;

  pageSizeList: any[] = [10, 25, 50, 100, 250];
  recordCount: number;

  castList: Actor[] = [];
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
      { name: "Profile", property: "profile", visible: true, alwaysShow: true },
       { name: "Username", property: "username", visible: true, alwaysShow: true,valuePath:'info.username' },
      { name: "About", property: "about", visible: true, alwaysShow: true },
        { name: "Image", property: "imageCount", visible: true, alwaysShow: true },
         { name: "Video", property: "videoCount", visible: true, alwaysShow: true },
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
        this.getAllCast();
      });
    this.getAllCast();
  }

  onPageChange(event: { pageIndex: number; pageSize: number }) {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.getAllCast();
  }

getImageCount(galleries: any[]): number {
  return galleries ? galleries.filter(file => file.fileType === "IMAGE_ACTOR").length : 0;
}

getVideoCount(galleries: any[]): number {
  return galleries ? galleries.filter(file => file.fileType === "VIDEO_ACTOR").length : 0;
}

  getAllCast() {
    let params: any = {
      page: this.page,
      size: this.size,
      sort: "id,asc",
    };

    if (
      this.form.get("key")?.value != undefined &&
      this.form.get("key")?.value != ""
    ) {
      params.key = this.form.get("key")?.value;
    }

  
    this.masterService.getAllCastApi(params).subscribe({
      next: (data) => {
        console.log("category data", data);
        this.recordCount = data.totalElements;
        this.castList = data.content;
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
        about: this.aboutTemplate,
        profile:this.profileTemplate,
        imageCount:this.imageCountTemplate,
        videoCount:this.videoCountTemplate
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

  openUserProfileDialog(row:Actor): void {

    const dialogRef = this.dialog.open(ViewActorComponent, {
      width: '90%',
      maxWidth: '900px',
      data: row,
      autoFocus: false,
      panelClass: 'user-profile-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
   openAddMediaDialog(type:'IMAGE'|'VIDEO',id:string): void {

    const dialogRef = this.dialog.open(UploadMediaComponent, {
      width: '90%',
      maxWidth: '900px',
      data: {type,id},
      autoFocus: false,
      panelClass: 'user-profile-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getAllCast();
      }
    });
  }

  

  openCreateDialog() {
    const dialogRef = this.dialog.open(ManageCastsComponent, {
    width: '600px',
    data: {} as CastFormData
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      console.log('Cast Created:', result);
      this.getAllCast();
    }
  });
  }

  openUpdateDialog(row: Category) {
    const dialogRef = this.dialog.open(ManageCastsComponent, {
      data: { action: "UPDATE", title: "Attribute Management", payload: row },
      width: "600px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined && result != "") {
        this.getAllCast();
      }
    });
  }

  delete(row: Actor) {
    console.log("delete row", row);
    const dialogRef = this.dialog.open(DeleteDailogComponent, {
      width: "400px",
      data: {
        title: "Confirm Delete" ,
        body:
          "Are you sure you want to Delete" +
         
          row.info.username,
        confirmText: "Yes",
        cancelText: "No",
      } as ModalData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined && result != "") {
        this.masterService.deleteActor(row.id).subscribe({
          next: (data) => {
            this._snackBar.open("Cast removed successfully.", "Close", {
              duration: 5000,
            });
            this.getAllCast();
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
}
