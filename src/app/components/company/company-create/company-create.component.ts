import { Component, OnInit }                  from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Company }                            from './../../../models/company.model';
import { MatSnackBar }                        from '@angular/material';
import { Util }                               from './../../../helpers/util.helper';

export interface CompanyInfo {
  name:string,
}

@Component({
  selector: 'app-company-create',
  templateUrl: './company-create.component.html',
  styleUrls: ['./company-create.component.css']
})
export class CompanyCreateComponent implements OnInit {
  company_info:CompanyInfo = {name:''};
  constructor(public snackBar: MatSnackBar) { }

  companyForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });

  getInputErrorMessage(input_name:string){
    var err_message:string = '';
    if(this.companyForm.get(input_name).hasError('required')) err_message = 'You must enter a Company name.';
    if(this.companyForm.get(input_name).hasError('custom')) {
      err_message = this.companyForm.get(input_name).getError('custom');
    }

    return err_message;
  }

  ngOnInit() {
  }

  async onSubmit(){
    let err, company;
    [err, company] = await Util.to(Company.CreateAPI(this.company_info));
    company.to('update');
  }

}
