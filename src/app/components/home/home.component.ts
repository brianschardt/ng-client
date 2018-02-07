import { Component, OnInit } from '@angular/core';
import {UtilService} from "../../services/util.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private util:UtilService) { }

  async ngOnInit() {

  }


}
