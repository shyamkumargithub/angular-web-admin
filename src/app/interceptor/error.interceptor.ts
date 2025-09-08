import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { environment } from 'src/environments/environment';


import { Router } from '@angular/router';
import { DataService } from '../shared/services/data.service';



@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {


    return next.handle(request).pipe(
      catchError((err) => {

        if (err.status === 401 ) {

         
          localStorage.clear();
          this.dataService.setUser(undefined);
          this.router.navigate(["/login"]);

        }else if(err.status==403){
           this.router.navigate(["/access-forbidden"]);
        }
        return throwError(err);
      }),
      finalize(() => {
      

      })
    );
  }
}
