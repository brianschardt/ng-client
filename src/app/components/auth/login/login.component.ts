import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, FormGroup, NgForm, Validators } from '@angular/forms';
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

  loginForm = new FormGroup({
    unique: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl(''),
  });

  getEmailErrorMessage() {
    var err_message:string = '';
    if(this.loginForm.get('unique').hasError('required')) err_message = 'You must enter an Email or Phone number.';
    if(this.loginForm.get('unique').hasError('custom')) {
      err_message = this.loginForm.get('unique').getError('custom');
    }

    return err_message;
  }

  getPasswordErrorMessage() {
    var err_message:string = '';
    if(this.loginForm.get('password').hasError('required')) err_message = 'You must enter a password.';
    if(this.loginForm.get('password').hasError('custom')) {
      err_message = this.loginForm.get('password').getError('custom');
    }

    return err_message;
  }

  getConfirmPasswordErrorMessage() {
    var err_message:string = '';
    if(this.loginForm.get('confirmPassword').hasError('custom')) {
      err_message = this.loginForm.get('confirmPassword').getError('custom');
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

  async login(data: Object){
    var err, res:any;
    [err, res] = await this.util.to(this.userService.loginReg(data));
    if(err){
      switch(err.message){
        case 'Please enter a password to login':
          this.loginForm.get('password').setErrors({custom: err.message});
          break;
        case 'Not registered':
          this.title = "Please Register";
          this.register = true;
          break;
        case 'invalid password':
          this.loginForm.get('password').setErrors({custom: err.message});
          break;
        default:
          this.loginForm.get('unique').setErrors({custom: err.message});
      }

      return;
    }

    this.util.route('user/profile');
  }

  async create(data: Object){
    if(this.user_info.confirm_password!=this.user_info.password){
      this.loginForm.get('password').setErrors({custom: 'Passwords do not match'});
      this.loginForm.get('confirmPassword').setErrors({custom: 'Passwords do not match'});
      return
    }

    let err, res;
    [err, res] = await this.util.to(this.userService.createAccount(data))

    if(err) this.util.TE(err);

    this.util.route('user/profile');
  }
}
