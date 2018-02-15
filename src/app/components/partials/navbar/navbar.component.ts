import { Component, OnInit } from '@angular/core';
import { UtilService } from './../../../services/util.service';
import { UserService } from './../../../services/user.service';
import { User } from './../../../models/user.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user:User ;
  constructor(public util:UtilService, public userService:UserService) {
  }

  ngOnInit() {
    this.user = User.Auth();
    User.onChange(()=>{
      this.user = User.Auth();
    });

  }

  onLogout(){
    if(this.user) this.user.logout();
  }

}
