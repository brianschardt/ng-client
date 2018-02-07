import { Component, OnInit } from '@angular/core';
import {UtilService} from "../../../services/util.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  date:Number = new Date().getFullYear();
  constructor(private util:UtilService) { }

  ngOnInit() {
  }

}
