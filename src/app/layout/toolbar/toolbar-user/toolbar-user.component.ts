import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/shared/services/data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'fury-toolbar-user',
  templateUrl: './toolbar-user.component.html',
  styleUrls: ['./toolbar-user.component.scss']
})
export class ToolbarUserComponent implements OnInit {

  isOpen: boolean;

  constructor(private router:Router,private dataService:DataService) { }

  ngOnInit() {
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  onClickOutside() {
    this.isOpen = false;
  }
  onClickLogout(){
      localStorage.removeItem(environment.userInfo)
        localStorage.removeItem(environment.access_token)
    this.dataService.setUser(undefined);
    this.router.navigate(["/login"]);

  }

}
