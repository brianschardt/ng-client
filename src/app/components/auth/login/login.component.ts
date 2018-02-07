import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { UtilService } from "../../../services/util.service";
import { UserService } from './../../../services/user.service';

export interface UserLoginInfo {
  unique:string,
  password?:string,
  confirm_password?:string,
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  user_info:UserLoginInfo = <UserLoginInfo>{ };
  title:string = 'Login / Register';
  register:boolean = false;

  emailBackendError:string = 'err';
  emailFrontendError = new FormControl('', [Validators.required]);
  getEmailErrorMessage() {
    return this.emailFrontendError.hasError('required') ? 'You must enter an Email or Phone number.' : '';
  }

  constructor(private util:UtilService, private userService:UserService) { }

  ngOnInit() {
  }

  async onSubmit(){
    var data = {
      unique_key    :this.user_info.unique,
      password      :this.user_info.password,
    };

    if(this.register==false){
      this.login(data);
    }

    return;

  }

  onTryLogin(){
    this.register = false;
    this.user_info.unique='';
    this.title="Log in / Register";
  }

  async login(data: Object){
    console.log('form', this.emailFrontendError);
    var err, res:any;
    [err, res] = await this.util.to(this.userService.loginReg(data));
    if(err){
      if(err.message=='Please enter a password to login'){
        console.log('***password err');
      }
      this.emailBackendError = err.message;
      console.log('err', this.emailBackendError);
      return;
    }
    this.emailBackendError = null;

  }
}
