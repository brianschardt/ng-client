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

  emailInput = new FormControl('', [Validators.required]);
  getEmailErrorMessage() {
    var err_message:string = '';
    if(this.emailInput.hasError('required')) err_message = 'You must enter an Email or Phone number.';
    if(this.emailInput.hasError('custom')) {
      err_message = this.emailInput.getError('custom');
    }

    return err_message;
  }

  passwordInput = new FormControl('', [Validators.required]);
  getPasswordErrorMessage() {
    var err_message:string = '';
    if(this.passwordInput.hasError('required')) err_message = 'You must enter a password.';
    if(this.passwordInput.hasError('custom')) {
      err_message = this.passwordInput.getError('custom');
    }

    return err_message;
  }

  confirmPasswordInput = new FormControl('');
  getConfirmPasswordErrorMessage() {
    var err_message:string = '';
    if(this.confirmPasswordInput.hasError('custom')) {
      err_message = this.confirmPasswordInput.getError('custom');
    }

    return err_message;
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
    }else{
      this.create(data);
    }

    return;

  }

  onTryLogin(){
    this.register = false;
    this.user_info.unique='';
    this.title="Log in / Register";
  }

  async
  async login(data: Object){
    var err, res:any;
    [err, res] = await this.util.to(this.userService.loginReg(data));
    if(err){
      switch(err.message){
        case 'Please enter a password to login':
          this.passwordInput.setErrors({custom: err.message});
          break;
        case 'Not registered':
          this.title = "Please Register"
          this.register = true;
          break;
        case 'invalid password':
          this.passwordInput.setErrors({custom: err.message});
          break;
        default:
          this.emailInput.setErrors({custom: err.message});
      }

      return;
    }

    this.util.route('user/profile');
  }

  async create(data: Object){
    if(this.user_info.confirm_password!=this.user_info.password){
      this.passwordInput.setErrors({custom: 'Passwords do not match'});
      this.confirmPasswordInput.setErrors({custom: 'Passwords do not match'});
      return
    }

    let err, res;
    [err, res] = await this.util.to(this.userService.createAccount(data))

    if(err) this.util.TE(err);

    this.util.route('user/profile');
  }
}
