
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedDataTableComponent } from "./components/shared-data-table/shared-data-table.component";
import { MaterialModule } from "src/@fury/shared/material-components.module";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatDividerModule } from "@angular/material/divider";
import { MatDialogModule } from "@angular/material/dialog";
import { ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatListModule } from "@angular/material/list";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { DeleteDailogComponent } from "./delete-dailog/delete-dailog.component";
import { AutoSearchSelectComponent } from "./components/auto-search-select/auto-search-select.component";
import { MultiSelectSearchComponent } from "./components/multi-select-search/multi-select-search.component";
import { MatChipsModule } from '@angular/material/chips';
import { FilePreviewDialogComponent } from './file-preview-dialog/file-preview-dialog.component';
@NgModule({
  declarations: [SharedDataTableComponent, DeleteDailogComponent,AutoSearchSelectComponent,MultiSelectSearchComponent, FilePreviewDialogComponent ],
  imports: [
    CommonModule,
    MaterialModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatListModule,
    MatInputModule,
    MatIconModule,
    FlexLayoutModule,
    MatButtonModule,
    MatChipsModule,
    MatCardModule,
  ],
  exports: [SharedDataTableComponent, DeleteDailogComponent,AutoSearchSelectComponent,MultiSelectSearchComponent,FilePreviewDialogComponent],
})
export class SharedModule {}
