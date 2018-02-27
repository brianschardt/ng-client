import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Util } from '../../../helpers/util.helper';
import { User } from '../../../models/user.model';
import {Company} from "../../../models/company.model";

export interface NavLinks {
  route?: string;
  name: string;
  sub_links?: Array <NavLinks>; // In case of nested dropdowns
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush, // this means it is not active checking for data changes
})

export class NavbarComponent implements OnInit {
  user: User;
  env;
  nav_links_user: Array<NavLinks> = [
    {route: 'user/update', name: 'Profile'},
    {route: 'company/create', name: 'Create Company'},
    {route: 'company/list', name: 'My Companies'}
  ];
  nav_links_no_user: Array<NavLinks> = [
    {route: 'home', name: 'Home'},
    {route: 'login', name: 'Login/Register'}
  ];

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.user = User.Auth();
    this.env = Util.env;
    // I am intentionally over complicating this here to show how useful this can become in a large app
    User.on(['auth', 'saveApi'], (auth_state) => {// data will be different depending on which event was emitted
      console.log('the user has:', auth_state);
      this.user = User.Auth();
      // we can dynamically make the view check on certain events. For large apps this is very efficient
      this.cd.markForCheck(); // this makes the view check for updates once
    });
  }

  onLogout(){
    if(User.Auth()) this.user.logout();
  }

}
