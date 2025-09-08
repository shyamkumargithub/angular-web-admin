import { Injectable, OnDestroy } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import each from "lodash-es/each";
import isArray from "lodash-es/isArray";
import isEqual from "lodash-es/isEqual";
import keys from "lodash-es/keys";
import sortBy from "lodash-es/sortBy";
import { BehaviorSubject } from "rxjs";
import { SidenavItem } from "./sidenav-item/sidenav-item.interface";
import { filter, map, takeUntil } from "rxjs/operators";
import { componentDestroyed } from "../../../@fury/shared/component-destroyed";
import { MediaObserver } from "@angular/flex-layout";

@Injectable()
export class SidenavService implements OnDestroy {
  mobileBreakpoint = "lt-md";

  /**
   * Sidenav Items
   * @type {BehaviorSubject<SidenavItem[]>}
   * @private
   */
  private _items = new BehaviorSubject<SidenavItem[]>([]);

  items$ = this._items.asObservable();

  get items(): SidenavItem[] {
    return this._items.getValue();
  }

  set items(items: SidenavItem[]) {
    this._items.next(items);
  }
  private manualToggles = new Map<SidenavItem, boolean | null>();
  /**
   * Currently Open
   * @type {BehaviorSubject<SidenavItem[]>}
   * @private
   */
  private _currentlyOpen = new BehaviorSubject<SidenavItem[]>([]);

  currentlyOpen$ = this._currentlyOpen.asObservable();

  get currentlyOpen(): SidenavItem[] {
    return this._currentlyOpen.getValue();
  }

  set currentlyOpen(currentlyOpen: SidenavItem[]) {
    this._currentlyOpen.next(currentlyOpen);
  }

  private _openSubject = new BehaviorSubject<boolean>(
    this.mediaObserver.isActive(this.mobileBreakpoint)
  );

  open$ = this._openSubject.asObservable();
  private _modeSubject = new BehaviorSubject<"side" | "over">(
    this.mediaObserver.isActive(this.mobileBreakpoint) ? "over" : "side"
  );
  mode$ = this._modeSubject.asObservable();
  private _collapsedSubject = new BehaviorSubject<boolean>(false);
  collapsed$ = this._collapsedSubject.asObservable();
  private _expandedSubject = new BehaviorSubject<boolean>(false);
  expanded$ = this._expandedSubject.asObservable();

  constructor(private router: Router, private mediaObserver: MediaObserver) {
    this.router.events
      .pipe(
        filter<NavigationEnd>((event) => event instanceof NavigationEnd),
        takeUntil(componentDestroyed(this))
      )
      .subscribe((event) => {
        const currentRouteItem = this.getItemByRouteRecursive(
          event.url,
          this.items
        );
        if (!currentRouteItem?.parent) {
          this.manualToggles.clear();
        } else {
          // --- Handle inactive parents here ---
          this.currentlyOpen.forEach((openItem) => {
            if (openItem.subItems?.length > 0) {
              const activeSubItem = openItem.subItems.find(
                (subItem) =>
                  typeof subItem.routeOrFunction === "string" &&
                  this.router.isActive(subItem.routeOrFunction, false)
              );
              if (!activeSubItem) {
                // No active child, collapse parent manually
                this.setManualToggle(openItem, false);
                this.currentlyOpen = this.currentlyOpen.filter(
                  (i) => i !== openItem
                );
              }
            }
          });
        }

        this.setCurrentlyOpenByRoute(event.url);

        if (this.mediaObserver.isActive(this.mobileBreakpoint)) {
          this._openSubject.next(false);
        }
      });

    this.mediaObserver
      .asObservable()
      .pipe(
        map(() => this.mediaObserver.isActive(this.mobileBreakpoint)),
        takeUntil(componentDestroyed(this))
      )
      .subscribe((isMobile) => {
        if (isMobile) {
          this._openSubject.next(false);
          this._modeSubject.next("over");
          this._collapsedSubject.next(false);
        } else {
          this._openSubject.next(true);
          this._modeSubject.next("side");
        }
      });
  }

  setManualToggle(item: SidenavItem, state: boolean | null) {
    this.manualToggles.set(item, state);
    this._currentlyOpen.next(this.currentlyOpen); // Trigger update
  }

  getManualToggle(item: SidenavItem): boolean | null {
    return this.manualToggles.get(item) ?? null;
  }

  clearManualToggle(item: SidenavItem) {
    this.manualToggles.set(item, null);
  }

  open() {
    this._openSubject.next(true);
  }

  close() {
    this._openSubject.next(false);
  }

  setCollapsed(collapsed: boolean) {
    this._collapsedSubject.next(collapsed);
  }

  toggleCollapsed() {
    this._collapsedSubject.next(!this._collapsedSubject.getValue());
  }

  setExpanded(expanded: boolean) {
    this._expandedSubject.next(expanded);
  }

  toggleExpanded() {
    this._expandedSubject.next(!this._expandedSubject.getValue());
  }

  addItems(items: SidenavItem[]) {
    items.forEach((item) => this.addItem(item));
  }

  addItem(item: SidenavItem) {
    const foundIndex = this.items.findIndex((existingItem) =>
      isEqual(existingItem, item)
    );
    if (foundIndex === -1) {
      this.setParentRecursive(item);
      this.items = [...this.items, item];
    }
  }

  toggleItemOpen(item: SidenavItem) {
    const isOpen = this.isOpen(item);
    const manualState = this.getManualToggle(item);
    // console.log('is open',isOpen)
    // console.log('is manualState',manualState)
    if (isOpen) {
      if (manualState === true) {
        // Was manually opened, now close it
        this.setManualToggle(item, false);
        this.currentlyOpen = this.currentlyOpen.filter((i) => i !== item);
      } else {
        // Was auto-opened by route, now manually close
        this.setManualToggle(item, true);
        this.currentlyOpen = this.currentlyOpen.filter((i) => i !== item);
      }
    } else {
      // Open it and remember this was manual
      this.setManualToggle(item, true);
      this.currentlyOpen = [
        ...new Set([...this.currentlyOpen, ...this.getParents(item)]),
      ];
    }
  }

  sortRecursive(array: SidenavItem[], propertyName: string): SidenavItem[] {
    const that = this;

    array.forEach(function (item) {
      const keyArray = keys(item);
      keyArray.forEach(function (key) {
        if (isArray(item[key])) {
          item[key] = that.sortRecursive(item[key], propertyName);
        }
      });
    });

    return sortBy(array, propertyName);
  }

  getItemByRoute(route) {
    return this.getItemByRouteRecursive(route, this.items);
  }

  ngOnDestroy(): void {}

  private getParents(item: SidenavItem, items: SidenavItem[] = []) {
    items.unshift(item);

    if (item.parent) {
      return this.getParents(item.parent, items);
    } else {
      return items;
    }
  }

  private isOpen(item: SidenavItem) {
    return this.currentlyOpen.indexOf(item) > -1;
  }

  private setCurrentlyOpenByRoute(route: string) {
    const item = this.getItemByRouteRecursive(route, this.items);
    let currentlyOpen = [];

    if (item) {
      // If it's a subitem, get all its parents
      if (item.parent) {
        currentlyOpen = this.getParents(item);
      }
      // If it's a parent item with subitems
      else if (item.subItems && item.subItems.length > 0) {
        currentlyOpen = [item];
      }
      // If it's a leaf item
      else {
        currentlyOpen = [item];
      }
    }

    // Preserve manual toggles
    this.manualToggles.forEach((state, toggleItem) => {
      if (state === true && !currentlyOpen.includes(toggleItem)) {
        currentlyOpen.push(toggleItem);
      }
    });

    this.currentlyOpen = currentlyOpen;
  }

  private getItemByRouteRecursive(route: string, collection: SidenavItem[]) {
    let result = collection.find((i) => i.routeOrFunction === route);

    if (!result) {
      each(collection, (item) => {
        if (item && item.subItems && item.subItems.length > 0) {
          const found = this.getItemByRouteRecursive(route, item.subItems);

          if (found) {
            result = found;
            return false;
          }
        }
      });
    }

    return result;
  }

  private setParentRecursive(item: SidenavItem) {
    if (item.subItems && item.subItems.length > 0) {
      item.subItems.forEach((subItem) => {
        subItem.parent = item;
        this.setParentRecursive(subItem);
      });
    }
  }
}
