import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { environment } from 'src/environments/environment';

import { SidenavService } from '../layout/sidenav/sidenav.service';
import { ROOT_LAYOUT_DATA } from '../data/sidebar-data';
import { DataService } from '../shared/services/data.service';
import { AuthService } from '../shared/services/auth.service';
import { User } from '../interface/user.interface';






export const canActivateAuthGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);
  const dataService = inject(DataService);
  const authService = inject(AuthService);
  const sidenavService = inject(SidenavService);


  try {
   const user: User = JSON.parse(localStorage.getItem(environment.userInfo));
    if ( user) {
     
      sidenavService.addItems(ROOT_LAYOUT_DATA);
       dataService.setUser(user);
      
    }

    return true;
  } catch (error: any) {
    snackBar.open(  "Authentication failed", "Close", {
      duration: 5000,
    });

    localStorage.removeItem(environment.userInfo)
    dataService.setUser(undefined);
    router.navigate(["/login"]);
    return false;
  }
};
