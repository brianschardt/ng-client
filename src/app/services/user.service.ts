import { Injectable }     from '@angular/core';
import { FacebookService, InitParams, LoginOptions } from 'ngx-facebook';
// import * as jwtDecode     from 'jwt-decode';
// import { CookieService }  from 'ngx-cookie-service';
import { LoginInfo }      from './../interfaces/login-info';
import { User }           from './../models/user.model';
import { UtilService }    from './util.service';

@Injectable()
export class UserService {

  _user:User;
  constructor(private util: UtilService, private fb: FacebookService) {
    // let initParams: InitParams = {
    //   appId: this.util.env.facebook_app_id,
    //   xfbml: true,
    //   version: 'v2.8'
    // };
    // this.fb.init(initParams);
  }

  use(){
    console.log('using user service');
  }

  set user(user:User){
    this._user = user;
  }

  get user(){
    if(!this._user) this._user = User.Auth();

    return this._user;
  }


  loggedIn(){ //so i change change how this is detected
    if(!this.user) return false;
    return true;
  }

  logout(routeToHome?){
    console.log('loggin out deleting user data');
    User.removeAllData();
    delete this._user;
    if(!routeToHome) this.util.route('/home');
  }

  login(info: LoginInfo){
    // this.setAuthToken(info.token);
    info.user.auth = true;
    info.user.token = info.token;
    this.user = <User> User.create(info.user);
    return this.user;
  }

  async createAccount(data:Object){
    let err, res:any;
    [err, res] = await this.util.to(this.util.post('/v1/users', data));

    if(err) this.util.TE(err, true);
    if(!res.success) this.util.TE(res.error, true);

    var login_info: LoginInfo = {
      token: res.token,
      user: res.user,
    };

    this.login(login_info);
    return login_info;
  }

  async loginReg(data: Object){
    let res:any;
    let err;
    [err, res] = await this.util.to(this.util.post('/v1/users/login', data));

    if(err) this.util.TE(err, true);

    if(!res.success) this.util.TE(res.error, true);

    var login_info: LoginInfo = {
      token: res.token,
      user: res.user,
    };

    this.login(login_info);
    return login_info;
  }

  // async loginSocial(service: String){
  //   let err, res;
  //   let login_info: LoginInfo
  //   switch(service){
  //     case 'facebook':
  //       // const scopes = 'public_profile,user_friends,email,pages_show_list';
  //       const scopes = 'public_profile,user_friends,email,user_birthday';
  //       const loginOptions: LoginOptions = {
  //         enable_profile_selector: true,
  //         return_scopes: true,
  //         scope: scopes
  //       };
  //       [err, res] = await this.util.to(this.fb.login(loginOptions));
  //
  //       let a_res = res.authResponse;
  //       [err, res] = await this.util.to(this.fb.api('/me'+'?fields=id,name,picture,email,birthday,gender,age_range,devices,location,first_name,last_name,website'));
  //       [err ,res] = await this.util.to(this.util.post('/v1/social-auth/facebook', {auth_response:a_res, user_info:res}));
  //
  //       if(res.success == false){
  //         err = res.error
  //       }
  //       if(err) this.util.TE(err, true);
  //       login_info = {
  //         token:res.token,
  //         user:res.user
  //       }
  //
  //       break;
  //     case  'google':
  //       err = 'google login not setup';
  //       break;
  //     default:
  //       err = 'no auth login service selected';
  //       break;
  //   }
  //
  //   if(!err){
  //     this.login(login_info);
  //   }
  //   return login_info
  // }

}
