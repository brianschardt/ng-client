import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { UtilService } from './../../../services/util.service';
import { UserService } from './../../../services/user.service';
import { User } from './../../../models/user.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,//this means it is not active checking for data changes
})
export class NavbarComponent implements OnInit {
  user:User ;
  constructor(public util:UtilService, public userService:UserService, private cd:ChangeDetectorRef) {
  }

  ngOnInit() {
    this.user = User.Auth();

    //I am specifically over complicating this here to show the power of this
    User.on(['auth', 'userSaveApi'], (auth_state)=>{
      console.log('the user has:', auth_state);
      
      //we can dynamically make the view check on cvertain events. For large apps this is very efficient
      this.cd.markForCheck();//this makes the view check for updates once
      this.user = User.Auth();
    });

  }

  onLogout(){
    if(User.Auth()) this.user.logout();
  }

}
