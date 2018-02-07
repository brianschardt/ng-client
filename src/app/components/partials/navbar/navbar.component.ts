import { Component, OnInit } from '@angular/core';
import { UtilService } from './../../../services/util.service';
import { UserService } from './../../../services/user.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private util:UtilService, private userService:UserService) { }

  ngOnInit() {
    this.util.use();
    this.userService.use();
  }

  onLogout(){
    this.userService.logout();
  }

}
