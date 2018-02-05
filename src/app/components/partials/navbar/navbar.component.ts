import { Component, OnInit } from '@angular/core';
import { UtilService } from './../../../services/util.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private utilService:UtilService) { }

  ngOnInit() {
    this.utilService.use();
  }

}
