import {
  Component,
  EventEmitter,
  TemplateRef,
  Input,
  Output,
  OnChanges,
  ViewChild,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { ListColumn } from "src/app/interface/listColumn";

@Component({
  selector: "shared-data-table",
  templateUrl: "./shared-data-table.component.html",
  styleUrls: ["./shared-data-table.component.scss"],
})
export class SharedDataTableComponent<T> {
  @Input() columns: {
    name: string;
    property: string;
    visible: boolean;
    cellTemplate?: TemplateRef<any>;
    alwaysShow: boolean;
  }[] = [];

  get displayedColumns(): string[] {
    return this.columns.filter((c) => c.visible).map((c) => c.property);
  }
  @Input() noDataLabel: string = "No data found";
  @Input() data: any[] = [];
  @Input() usePaginator: boolean = true;
  @Input() pageSize: number = 10;
  @Input() pageSizeOptions: number[] = [10, 25, 50];
  @Input() totalRecords: number = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Output() pageChange = new EventEmitter<{
    pageIndex: number;
    pageSize: number;
  }>();

  getNestedValue(row: any, column: ListColumn): any {
    try {
      if (column.valuePath && typeof column.valuePath === "string") {
        return (
          column.valuePath.split(".").reduce((acc, part) => acc?.[part], row) ??
          ""
        );
      } else {
        return row?.[column.property] ?? "";
      }
    } catch {
      return "";
    }
  }

  onPageChange(event: any) {
    this.pageChange.emit({
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
    });
  }
}
