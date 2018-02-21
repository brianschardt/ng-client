import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Util } from "../../../helpers/util.helper";
import { Company } from "./../../../models/company.model";
import { User } from "./../../../models/user.model";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar }            from '@angular/material';

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

  constructor(private aRoute: ActivatedRoute, public snackBar: MatSnackBar) {
  }

  async ngOnInit() {
    this.url_params = await Util.getUrlParams(this.aRoute);
    this.company = await Company.getById(this.url_params.id);
    this.users = this.company.Users();

  }

  async onSubmit(){
    let err, res;
    [err, res] = await Util.to(this.company.saveAPI());
    if(err){
      if(err.message == 'Nothing Updated') this.snackBar.open('Company', 'Nothing to Update', {duration: 2000});
      return;
    }

    this.snackBar.open('Company', 'Successfully updated', {duration: 2000});
  }
}
