import { Component, OnInit }      from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Util }                   from "../../../helpers/util.helper";

import { User }                   from './../../../models/user.model';
import { Company }                from './../../../models/company.model';
import { MatSnackBar }            from '@angular/material';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User;
  company: Company;

  profileForm = new FormGroup({
    email: new FormControl('', []),
    phone: new FormControl('', []),
    first: new FormControl('', []),
    last: new FormControl('', []),
    full_name: new FormControl('', []),
  });

  getInputErrorMessage(input_name:string){
    var err_message:string = '';
    if(this.profileForm.get(input_name).hasError('required')) err_message = 'You must enter an Email or Phone number.';
    if(this.profileForm.get(input_name).hasError('custom')) {
      err_message = this.profileForm.get(input_name).getError('custom');
    }

    return err_message;
  }

  throwInputError(input_name:string, message:string){
    this.profileForm.get(input_name).setErrors({custom: message});
  }

  constructor(public snackBar: MatSnackBar) { }

  ngOnInit() {

    this.user  = User.Auth();

  }

  ngOnDestroy(){
    if(User.Auth()) this.user.reload(); //makes sure if values arent saved other components arent updated
  }

  async onSubmit(){
    // console.log('user', this.user);
    let err, res;
    [err, res] = await Util.to(this.user.saveAPI());

    if(err){
      if(err.message.includes('phone') || err.message.includes('Phone')){
        this.throwInputError('phone', err.message);
      }

      if(err.message.includes('email') || err.message.includes('Email')){
        this.throwInputError('email', err.message);
      }

      if(err.message == 'Nothing Updated') this.snackBar.open('User', 'Nothing to Update', {duration: 2000});

      return;
    }


    this.snackBar.open('User', 'Successfully Updated', {duration: 2000});

  }

}
