import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { fadeInUpAnimation } from "../../../../@fury/animations/fade-in-up.animation";
import { AuthService } from "src/app/shared/services/auth.service";
import { environment } from "src/environments/environment";
import { User } from "src/app/interface/user.interface";

@Component({
  selector: "fury-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  animations: [fadeInUpAnimation],
})
export class LoginComponent implements OnInit {
  form: UntypedFormGroup;

  inputType = "password";
  visible = false;

  constructor(
    private router: Router,
    private fb: UntypedFormBuilder,
    private cd: ChangeDetectorRef,
    private snackbar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });

   // const token = localStorage.getItem(environment.access_token);
    const user: User = JSON.parse(localStorage.getItem(environment.userInfo));
    if ( user) {
     
        this.router.navigate(["/"]);
      
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.snackbar.open("Please enter valid username & password.", "Close", {
        duration: 5000,
      });
      return;
    }

    this.login();
  }

  login() {


    if(this.form.get('username').value=='admin' && this.form.get('password').value=='admin@123'){
       localStorage.setItem(environment.userInfo, JSON.stringify(this.form.value));
          const username = this.form.get('username').value=='admin'; // Replace with actual username
        const password =this.form.get('password').value; // Replace with actual password
       const basicToken = btoa(`${username}:${password}`);

       localStorage.setItem(environment.access_token,basicToken),
       this.router.navigate(["/"]);
    }else{
       this.snackbar.open("Invalid credentials" ,"Close", {
          duration: 5000,
        });
    }
   
  }


  toggleVisibility() {
    if (this.visible) {
      this.inputType = "password";
      this.visible = false;
      this.cd.markForCheck();
    } else {
      this.inputType = "text";
      this.visible = true;
      this.cd.markForCheck();
    }
  }
}
