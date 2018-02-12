import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilService } from "../../../services/util.service";
import { UserService } from './../../../services/user.service';
import { User } from './../../../models/user.model';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user;

  profileForm = new FormGroup({
    email: new FormControl('', []),
    phone: new FormControl('', []),
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

  constructor(private util:UtilService, private userService:UserService, public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.user = User.Auth();
    // this.profileForm.get('email').setValue('adfs');
  }


  async onSubmit(){
    let err, res;
    [err, res] = await this.util.to(this.user.saveAPI());

    if(err){
      if(err){
        switch(err.message){
          case 'This email address is already in use':
            this.throwInputError('email', err.message);
          default:
            this.throwInputError('email', err.message);
        }

        return;
      }
    }

    this.snackBar.open('User', 'Successfully Updated', {
      duration: 2000,
    });

  }

}
