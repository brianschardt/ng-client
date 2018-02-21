import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { UtilService } from "../../../services/util.service";
import { Company } from "./../../../models/company.model";
import { User } from "./../../../models/user.model";
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-company-update',
  templateUrl: './company-update.component.html',
  styleUrls: ['./company-update.component.css']
})
export class CompanyUpdateComponent implements OnInit {

  url_params;
  company:any = {name:''};
  users:Array<User>;

  companyForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });

  getInputErrorMessage(input_name:string){
    var err_message:string = '';
    if(this.companyForm.get(input_name).hasError('required')) err_message = 'You must enter an Email or Phone number.';
    if(this.companyForm.get(input_name).hasError('custom')) {
      err_message = this.companyForm.get(input_name).getError('custom');
    }

    return err_message;
  }

  constructor(private aRoute: ActivatedRoute, private util:UtilService) {
  }

  async ngOnInit() {
    this.url_params = await this.util.getUrlParams(this.aRoute);
    this.company = await Company.getById(this.url_params.id);
    this.users = this.company.Users();

    console.log('users', this.users);
  }

  async onSubmit(){
    
  }
}
