import { Component, HostBinding, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SidenavItem } from './sidenav-item/sidenav-item.interface';
import { SidenavService } from './sidenav.service';
import { ThemeService } from '../../../@fury/services/theme.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/shared/services/data.service';
import { User } from 'src/app/interface/user.interface';
import { UserPageActionCode } from 'src/app/enums/usersPageActionCode';

@Component({
  selector: "fury-sidenav",
  templateUrl: "./sidenav.component.html",
  styleUrls: ["./sidenav.component.scss"],
})
export class SidenavComponent implements OnInit, OnDestroy {
  sidenavUserVisible$ = this.themeService.config$.pipe(
    map((config) => config.sidenavUserVisible)
  );

  userPageActionCode: any = UserPageActionCode;
  currentUser: User;

  @Input()
  @HostBinding("class.collapsed")
  collapsed: boolean;

  @Input()
  @HostBinding("class.expanded")
  expanded: boolean;

  items$: Observable<SidenavItem[]>;

  constructor(
    private router: Router,
    private sidenavService: SidenavService,
    private dataService: DataService,

    private snackBar: MatSnackBar,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.dataService.currentUser.subscribe((user) => {
      if (user != undefined) {
        // console.log(">>>>>>>>>>current user",user)
        this.currentUser = user;
      }
    });

      // if (
      //   this.currentUser.roles.includes("Collection Center") ||
      //   this.currentUser.roles.includes("Report Verifier") ||
      //   this.currentUser.roles.includes("Root")
      // )
        if (
          true
        ) {
          this.items$ = this.sidenavService.items$.pipe(
            map((items: SidenavItem[]) =>
              this.sidenavService.sortRecursive(items, "position")
            )
          );
        } else {
          this.items$ = this.sidenavService.items$.pipe(
            map((items: SidenavItem[]) => {
              // Step 1: Filter items based on permissions
              // console.log(">>>>>>>>>>>>>items", items);
              // console.log(">>>>>>>>>>>>>currentlyOpen", this.sidenavService.currentlyOpen);
              const filteredItems = this.filterItemsByPermission(items);
              // Step 2: Sort the filtered items recursively
              return this.sidenavService.sortRecursive(
                filteredItems,
                "position"
              );
            })
          );
        }
  }

  filterItemsByPermission(items: SidenavItem[]): SidenavItem[] {
    return items
      .map((item) => {
        // If the item is a subheading, include it without permission check
        if (item.type === "subheading") {
          return { ...item }; // Return subheading without filtering
        }

        // If the item is an 'item', has no subItems, and has a permissionCode, check the permission
        if (item.type === "item" && !item.subItems && item.permissionCode) {
          const hasPermission = this.checkPermission(item.permissionCode);
          return hasPermission ? { ...item } : null;
        }

        // Recursively filter sub-items if they exist
        const filteredSubItems = item.subItems
          ? this.filterItemsByPermission(item.subItems) // Pass only subItems recursively
          : [];

        // Check if the current item or any sub-item has permission
        const hasPermissionForItem = this.checkPermission(item.permissionCode);

        // If the item has permission or any of its sub-items have permission, include the item
        const shouldIncludeItem =
          hasPermissionForItem || filteredSubItems.length > 0;

        // Return the item with filtered sub-items if it should be included
        return shouldIncludeItem
          ? { ...item, subItems: filteredSubItems }
          : null;
      })
      .filter((item) => item !== null); // Filter out items that don't have permission
  }

  private checkPermission(permissionCode: string | string[]): boolean {
    if (Array.isArray(permissionCode)) {
      // Check if the user has any of the permissions in the array
      return permissionCode.some((code) =>
        this.dataService.hasPermission(code)
      );
    }
    // Check permission for a single string
    return this.dataService.hasPermission(permissionCode);
  }
  toggleCollapsed() {
    this.sidenavService.toggleCollapsed();
  }

  @HostListener("mouseenter")
  @HostListener("touchenter")
  onMouseEnter() {
    this.sidenavService.setExpanded(true);
  }

  @HostListener("mouseleave")
  @HostListener("touchleave")
  onMouseLeave() {
    this.sidenavService.setExpanded(false);
  }

  ngOnDestroy() {}
}
