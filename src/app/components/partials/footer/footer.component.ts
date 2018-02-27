import { Component, OnInit } from '@angular/core';
import { Util } from '../../../helpers/util.helper';
import { User } from '../../../models/user.model';

export interface FooterLinks {
  header: string;
  links: [{
    name: string;
    route: string;
  }];
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})

export class FooterComponent implements OnInit {
  date: number = new Date().getFullYear();
  env;
  user: User;

  // Refers to interface in case footer links are specialized for each user
  // this is all hard coded data. can be pulled from a db/user specific
  footer_links: Array<FooterLinks> = [
    {
      header: 'Products',
      links: [
        {name: 'Software', route: 'home'},
        {name: 'Hardware', route: 'login'},
        {name: 'Robots', route: 'home'}
        ]
    },
    {
      header: 'Contact',
      links: [
        {name: 'Email', route: 'home'},
        {name: 'Call', route: 'login'},
        {name: 'Locations', route: 'user/update'}
        ]
    },
    {
      header: 'About',
      links: [
        {name: 'Our Mission', route: 'home'},
        {name: 'Our Story', route: 'login'},
        {name: 'Our People', route: 'home'}
        ]
    }
    ];

  constructor() { }

  ngOnInit() {
    this.user = User.Auth();
    this.env = Util.env;
    User.on(['auth', 'saveApi'], (auth_state) => { // data will be different depending on which event was emitted
      console.log('the user has:', auth_state);
      this.user = User.Auth();
      // we can dynamically make the view check on cvertain events. For large apps this is very efficient
    });
    }
}
