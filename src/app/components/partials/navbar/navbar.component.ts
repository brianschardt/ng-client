import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { UtilService } from './../../../services/util.service';
import { UserService } from './../../../services/user.service';
import { User } from './../../../models/user.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit {
  user:User ;
  constructor(public util:UtilService, public userService:UserService, private cd:ChangeDetectorRef) {
  }

  ngOnInit() {
    this.user = User.Auth();

    User.onChange(()=>{
      this.cd.markForCheck();//this updates the data on the component
      this.user = User.Auth();
    });

  }

  onLogout(){
    if(User.Auth()) this.user.logout();
  }

}
