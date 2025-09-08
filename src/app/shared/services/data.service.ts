
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: "root",
})
export class DataService {
  getChartImage(): any {
    throw new Error("Method not implemented.");
  }
  constructor() { }

  private userSubject = new BehaviorSubject(undefined);
  currentUser = this.userSubject.asObservable();
  setUser(user: any) {
    this.userSubject.next(user);
  }



  private imageSource = new BehaviorSubject<string | undefined>(undefined);
  image = this.imageSource.asObservable();


    // Set the Base64 image and save it in localStorage
  setImage(image: string): void {
    this.imageSource.next(image);
    localStorage.setItem('image', image); // Save the image to localStorage
  }

  // Get the latest image (sync)
  getImage(): string | undefined {
    return this.imageSource.getValue();
  }

  // Clear the image and remove it from localStorage
  clearImage(): void {
    this.imageSource.next(undefined);
    localStorage.removeItem('image'); // Remove the image from localStorage
  }
  hasPermission(permissionCode: string): boolean {
    let hasPermission = false;

    // Get the current user value from the BehaviorSubject
    const user = this.userSubject.getValue();
    //console.log(">>>>>>>>>>>>>>>>>user subject",user)

    if (user.roles?.includes('Root') || user.roles?.includes('Super Admin')) {
      return true
    } else {
      // Check if the user and their rolePermissionInfos are defined
      if (user && user.rolePermissionInfos) {
        const hasPermissionData = user.rolePermissionInfos.find(
          (rolePermission: any) =>
            rolePermission.permission.code === permissionCode
        );

        // If matching permission is found, return true
        if (hasPermissionData) {
          hasPermission = true;
        }
      }

      return hasPermission;
    }


  }
}

