import { Component, OnInit }  from '@angular/core';
import { Util }          from "../../../helpers/util.helper";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  date:Number = new Date().getFullYear();
  env;
  constructor() { }

  ngOnInit() {
    this.env = Util.env;
  }

}
