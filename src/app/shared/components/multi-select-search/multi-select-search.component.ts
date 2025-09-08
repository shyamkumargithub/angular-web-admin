import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { MatSelectionListChange } from "@angular/material/list";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AutoSearchType } from "src/app/enums/autoSearchingType.enum";
import { MasterService } from "src/app/pages/master/master.service";


@Component({
  selector: "shared-multi-select-search",
  templateUrl: "./multi-select-search.component.html",
  styleUrls: ["./multi-select-search.component.scss"],
})
export class MultiSelectSearchComponent implements OnInit {
  @Input() label: string = "Search";
  @Input() type: AutoSearchType = AutoSearchType.ATTRIBUTE_SEARCH;
  @Input() displayProperty: string = "name";
  @Input() maxSelectLimit: number = 5;
  @Input() selectedvalue: string[] = [];
  @Input() required: boolean = false;
  @Output() itemSelected = new EventEmitter<any[]>(); // Emit selected items as an array

  inputSearch = "";
  searchForm: FormGroup;
  @ViewChild("searchInput", { static: false }) searchInput!: ElementRef;

  filteredItems: any[] = [];
  selectedItems: any[] = [];
  isCardVisible: boolean = false;
  isSearching: boolean = false;
  isAllSelected: boolean = false;

  constructor(
    private masterService: MasterService,
    private fb: FormBuilder,
    private elementRef: ElementRef
  ) {
    this.searchForm = this.fb.group({
      searchQuery: ["", this.required ? Validators.required : null],
    });
  }

  ngOnInit(): void {
    this.searchForm.get("searchQuery")?.setValue(this.selectedvalue);
    this.selectedItems = this.selectedvalue;
    if (this.required) {
      this.addRequiredValidator();
    } else {
      this.removeRequiredValidator();
    }
  }

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
    //console.log("=========changes sselected value", changes["selectedvalue"]);
  }

  isString(value: any): boolean {
    return typeof value === "string";
  }
  isItemSelected(item: any): boolean {
    return this.selectedItems.some((selectedItem) =>
      this.isString(selectedItem)
        ? selectedItem === item[this.displayProperty]
        : selectedItem[this.displayProperty] === item[this.displayProperty]
    );
  }
  toggleCardVisibility(): void {
    this.isCardVisible = !this.isCardVisible;
    if (this.isCardVisible) {
      setTimeout(() => {
        if (this.isCardVisible && this.searchInput) {
          this.searchInput.nativeElement.focus();
        }
      }, 100);
    } else {
      //this.itemSelected.emit(this.selectedItems);
    }
  }

  @HostListener("document:click", ["$event"])
  onClickOutside(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isCardVisible = false;
      this.updateReadonlyInputValue();
      if (!this.isCardVisible) {
        // this.itemSelected.emit(this.selectedItems);
      }
    }
  }

  searchItem(value: string): void {
    if (this.type === AutoSearchType.ATTRIBUTE_SEARCH) {
      this.searchAttribute(value);
    }
  }

  searchAttribute(value: string): void {
    if (value.length > 0) {
      this.isSearching = true;
      
    } else {
      this.filteredItems = [];
      this.isSearching = false;
    }
  }

  reset(): void {
    this.inputSearch = "";
    this.selectedItems = [];
    this.searchForm.reset();
    this.filteredItems = [];
  }

  clearSearch(event: MouseEvent): void {
    event.stopPropagation();
    this.inputSearch = "";
    this.filteredItems = [];
    this.isSearching = false;
    if (!this.isCardVisible) {
      // this.itemSelected.emit(this.selectedItems);
    }
  }

  onSelectionChange(event: MatSelectionListChange): void {
    event.options.forEach((option) => {
      const selectedValue = option.value;
      const isSelected = option.selected;

      if (isSelected) {
        const exists = this.selectedItems.some((item) =>
          this.isString(item)
            ? item === selectedValue[this.displayProperty]
            : item[this.displayProperty] === selectedValue[this.displayProperty]
        );

        if (!exists) {
          this.selectedItems = [...this.selectedItems, selectedValue];
        }
      } else {
        this.selectedItems = this.selectedItems.filter((item) =>
          this.isString(item)
            ? item !== selectedValue[this.displayProperty]
            : item[this.displayProperty] !== selectedValue[this.displayProperty]
        );
      }
    });

    this.updateReadonlyInputValue();
    this.updateSelectAllState();
  }

  clearSelectedItem(item: any): void {
    this.selectedItems = this.selectedItems.filter(
      (selectedItem) => selectedItem !== item
    );
    this.updateReadonlyInputValue();
    this.updateSelectAllState();
    // this.itemSelected.emit(this.selectedItems);
  }

  private previousSearchValue: string = "";

  updateReadonlyInputValue(): void {
    let newValue = "";

    if (this.selectedItems.length === 0) {
      newValue = "";
    } else if (this.selectedItems.length === 1) {
      newValue = this.isString(this.selectedItems[0])
        ? this.selectedItems[0]
        : this.selectedItems[0][this.displayProperty];
    } else {
      newValue = this.isString(this.selectedItems[0])
        ? `${this.selectedItems[0]} +${this.selectedItems.length - 1} ${
            this.label
          }`
        : `${this.selectedItems[0][this.displayProperty]} +${
            this.selectedItems.length - 1
          } ${this.label}`;
    }

    if (newValue.trim() !== "" && newValue !== this.previousSearchValue) {
      this.itemSelected.emit(this.selectedItems);
    }

    this.previousSearchValue = newValue;
    this.searchForm.get("searchQuery")?.setValue(newValue);
  }

  toggleSelectAll(): void {
    let total = this.selectedItems.length;

    let filterItems = this.filteredItems.slice(
      0,
      total > 0 ? this.maxSelectLimit - total : this.maxSelectLimit
    );
    this.selectedItems = this.isAllSelected
      ? [...this.selectedItems, ...filterItems]
      : [];
    this.updateReadonlyInputValue();
    this.updateSelectAllState();
    // this.itemSelected.emit(this.selectedItems);
  }

  updateSelectAllState(): void {
    this.isAllSelected =
      this.selectedItems.length === this.filteredItems.length &&
      this.filteredItems.length > 0;
  }

  isSelectionDisabled(item: any): boolean {
    return (
      this.selectedItems.length >= this.maxSelectLimit &&
      !this.selectedItems.includes(item)
    );
  }
}

