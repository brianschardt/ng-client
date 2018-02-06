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
    let err, res
    [err, res] = await this.util.to(this.util.post('/v1/users', {email:'brianss@gmail.com', password:'test'}));
    if(err) this.util.TE('error', err);

    console.log('res', res)
  }


}
