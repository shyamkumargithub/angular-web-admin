import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import { environment } from "src/environments/environment";
import { DataService } from "./data.service";
import { Observable } from "rxjs";
import { User } from "src/app/interface/user.interface";

interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  "not-before-policy": number;
  session_state: string;
  scope: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(
    private dataService: DataService,
    private http: HttpClient,
    private router: Router
  ) {}
 



}
