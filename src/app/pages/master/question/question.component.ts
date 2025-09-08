import { FormBuilder, FormGroup } from "@angular/forms";

import {
  ChangeDetectorRef,
  Component,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MasterService } from "../master.service";
import { ListColumn } from "src/app/interface/listColumn";
import { debounceTime } from "rxjs";
import { DeleteDailogComponent } from "src/app/shared/delete-dailog/delete-dailog.component";
import { ModalData } from "src/app/interface/DeleteModalData";
import { environment } from "src/environments/environment";
import { ManageQuestionComponent } from "./manage-question/manage-question.component";
import { Quiz } from "src/app/interface/Quiz";


@Component({
  selector: 'CoreLab-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent {
   baseUrl = environment.server;
  @ViewChild("actionsTemplate", { static: true })
  actionsTemplate!: TemplateRef<any>;
  @ViewChild("firstPosTemplate", { static: true })
  firstPosTemplate!: TemplateRef<any>;

  @ViewChild("optionsTemplate", { static: true })
  optionsTemplate!: TemplateRef<any>;

  columns: ListColumn[] = [];
  displayedColumns: ListColumn[] = [];

  page: Number = 0;
  size: Number = 10;

  pageSizeList: any[] = [10, 25, 50, 100, 250];
  recordCount: number;

  questionList: Quiz[] = [];
  form: FormGroup;
  categories: string[] = [];
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
      { name: "Text", property: "text", visible: true, alwaysShow: true,valuePath:'text' },
      { name: "Category", property: "category", visible: true, alwaysShow: true },
      { name: "Options", property: "options", visible: true, alwaysShow: true,},
  
     
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
      category:[""]
    });

    this.form.valueChanges
      .pipe(debounceTime(400))
      .subscribe((selectedValue) => {
        this.getAllQuestion();
      });
    this.getAllCategories();
    this.getAllQuestion();
  }

  getAllCategories() {
    this.masterService.getQuizCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  onPageChange(event: { pageIndex: number; pageSize: number }) {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.getAllQuestion();
  }

  getAllQuestion() {
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

      if (
      this.form.get("category")?.value != undefined &&
      this.form.get("category")?.value != ""
    ) {
      params.category = this.form.get("category")?.value;
    }

  
    this.masterService.getAllQuestionApi(params).subscribe({
      next: (data) => {
    
        this.recordCount = data.totalElements;
        this.questionList = data.content;
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
        options: this.optionsTemplate,
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
    const dialogRef = this.dialog.open(ManageQuestionComponent, {
      data: { action: "CREATE", title: "Question Management", defaultValues: null },
      width: "600px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined && result != "") {
        this.getAllQuestion();
      }
    });
  }

  openUpdateDialog(row: Quiz) {
    const dialogRef = this.dialog.open(ManageQuestionComponent, {
      data: { action: "UPDATE", title: "Question Management", defaultValues: row },
      width: "600px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined && result != "") {
        this.getAllQuestion();
      }
    });
  }

  delete(row: Quiz) {
    console.log("delete row", row);
    const dialogRef = this.dialog.open(DeleteDailogComponent, {
      width: "400px",
      data: {
        title: "Confirm Delete" ,
        body:
          "Are you sure you want to Delete " +
         
          row.text,
        confirmText: "Yes",
        cancelText: "No",
      } as ModalData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined && result != "") {
        this.masterService.deleteQuiz(row.id).subscribe({
          next: (data) => {
            this._snackBar.open("Question deleted successfully.", "Close", {
              duration: 5000,
            });
            this.getAllQuestion();
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
