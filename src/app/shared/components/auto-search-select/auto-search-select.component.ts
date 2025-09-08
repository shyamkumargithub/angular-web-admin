import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  startWith,
} from "rxjs";
import { AutoSearchType } from "src/app/enums/autoSearchingType.enum";
import { MasterService } from "src/app/pages/master/master.service";

@Component({
  selector: "shared-auto-search-select",
  templateUrl: "./auto-search-select.component.html",
  styleUrls: ["./auto-search-select.component.scss"],
})
export class AutoSearchSelectComponent implements OnInit {
  @Input() label: string = "Search";
  @Input() type: AutoSearchType = AutoSearchType.ATTRIBUTE_SEARCH;
  @Input() displayProperty: string = "name";
  @Input() selectedvalue: string = "";
  @Output() itemSelected = new EventEmitter<any>();
  @Output() searchCleared = new EventEmitter<void>();
  @Input() isDisabled: boolean = false;
  @Input() required: boolean = false;
  @Input() willShowSelectedValue: boolean = true;

  isLoading: boolean = false;
  searchForm: FormGroup;
  filteredOptions: any[] = [];

  constructor(
    private fb: FormBuilder,

    private masterSerive: MasterService,
    private _snackBar: MatSnackBar
  ) {
    this.searchForm = this.fb.group({
      searchQuery: ["", this.required ? Validators.required : null],
    });
  }

  ngOnInit(): void {
    if (this.required) {
      this.addRequiredValidator();
    } else {
      this.removeRequiredValidator();
    }
    if (this.isDisabled) {
      this.searchForm.get("searchQuery")?.disable();
    }
  }

  // Dynamically add required validator
  private addRequiredValidator(): void {
    const searchQueryControl = this.searchForm.get("searchQuery");
    searchQueryControl?.setValidators(Validators.required);
    searchQueryControl?.updateValueAndValidity();
  }

  // Dynamically remove required validator
  private removeRequiredValidator(): void {
    const searchQueryControl = this.searchForm.get("searchQuery");
    searchQueryControl?.clearValidators();
    searchQueryControl?.updateValueAndValidity();
  }

  ngOnChanges(changes: SimpleChanges): void {
    //  console.log(
    //    "=========changes sselected value",
    //    changes["selectedvalue"].currentValue
    //  );
    if (changes["isDisabled"]) {
      const searchQueryControl = this.searchForm.get("searchQuery");
      if (this.isDisabled) {
        searchQueryControl?.disable();
      } else {
        searchQueryControl?.enable();
      }
    }

    if (changes["selectedvalue"] && changes["selectedvalue"].currentValue) {
      this.searchForm.get("searchQuery")?.setValue(this.selectedvalue);
    }
  }
  reset(): void {
    this.searchForm.reset();
    this.filteredOptions = [];
    this.searchForm.get("searchQuery")?.setValue("");
    this.searchCleared.emit();
    if (this.required) {
      this.addRequiredValidator();
    } else {
      this.removeRequiredValidator();
    }
  }

  clearSearch(): void {
    this.searchForm.reset();
    this.searchForm.get("searchQuery")?.setValue("");
    this.filteredOptions = [];
    this.searchCleared.emit();
    if (this.required) {
      this.addRequiredValidator();
    } else {
      this.removeRequiredValidator();
    }
  }

  // Handle blur event
  handleBlur(): void {
    const currentValue = this.searchForm.get("searchQuery")?.value;
    const selectedValue = this.selectedvalue;

    if (
      (!this.filteredOptions || this.filteredOptions.length === 0) &&
      currentValue !== selectedValue
    ) {
      // this.searchForm.get("searchQuery")?.setValue(selectedValue);
    }
  }

  searchItem(value: string): void {
    if (this.type === AutoSearchType.UOM_SEARCH) {
      this.searchUom(value);
    }
  }

  searchUom(value: string): void {
    if (value.length > 0) {
      this.isLoading = true;
      let params: any = {
        key: value,
      };
      // this.masterSerive.getAllUomApi(params).subscribe({
      //   next: (response) => {
      //     this.filteredOptions = response.content;
      //     this.isLoading = false;
      //   },
      //   error: () => {
      //     this.filteredOptions = [];
      //     this.isLoading = false;
      //   },
      // });
    } else {
      this.isLoading = false;
      this.filteredOptions = [];
    }
  }


  onOptionSelected(item: any): void {
    console.log(">>>>>>>>>>option selected", item);
    if (this.willShowSelectedValue) {
      this.searchForm.get("searchQuery")?.setValue(item[this.displayProperty]);
    } else {
      this.searchForm.get("searchQuery")?.setValue("");
    }
    this.itemSelected.emit(item);
  }
}

