import { Injectable }     from '@angular/core';
import { FacebookService, InitParams, LoginOptions } from 'ngx-facebook';
import { environment }    from '../../environments/environment';
import { UtilService }    from './util.service';
import * as jwtDecode     from 'jwt-decode';
import { CookieService }  from 'ngx-cookie-service';
import { LoginInfo }      from './../interfaces/login-info';
import { User }           from './../models/user.model';

@Injectable()
export class UserService {

  auth:User;
  constructor(private util: UtilService, private fb: FacebookService, private cookieService:CookieService) {
    let initParams: InitParams = {
      appId: environment.facebook_app_id,
      xfbml: true,
      version: 'v2.8'
    };
    this.fb.init(initParams);
  }

  use(){
    //does nothing just to stop throwing error
  }


  logout(){
    this.deleteAuthToken();
    this.util.removeLocalStorage('user');
    // this.user = null;
  }

  login(info: LoginInfo){
    this.setAuthToken(info.token)
    this.util.setlocalStorage('user', info.user);
    this.auth = <User> User.create(info.user);

    console.log('auth user', this.auth);
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

  async loginSocial(service: String){
    let err, res;
    let login_info: LoginInfo
    switch(service){
      case 'facebook':
        // const scopes = 'public_profile,user_friends,email,pages_show_list';
        const scopes = 'public_profile,user_friends,email,user_birthday';
        const loginOptions: LoginOptions = {
          enable_profile_selector: true,
          return_scopes: true,
          scope: scopes
        };
        [err, res] = await this.util.to(this.fb.login(loginOptions));

        let a_res = res.authResponse;
        [err, res] = await this.util.to(this.fb.api('/me'+'?fields=id,name,picture,email,birthday,gender,age_range,devices,location,first_name,last_name,website'));
        [err ,res] = await this.util.to(this.util.post('/v1/social-auth/facebook', {auth_response:a_res, user_info:res}));

        if(res.success == false){
          err = res.error
        }
        if(err) this.util.TE(err, true);
        login_info = {
          token:res.token,
          user:res.user
        }

        break;
      case  'google':
        err = 'google login not setup';
        break;
      default:
        err = 'no auth login service selected';
        break;
    }

    if(!err){
      this.login(login_info);
    }
    return login_info
  }

  setAuthToken(token){
    let dec = jwtDecode(token)
    var date = new Date(dec.exp*1000);
    // this.user = dec._doc;
    this.cookieService.set('token', token, date);
  }

  deleteAuthToken(){
    console.log('deleting auth token');
    return this.cookieService.delete('token');
  }
  getAuthToken(){
    return this.cookieService.get('token');
  }

  loggedIn(){
    if(!this.getAuthToken()){
      return false;
    }

    return true;
  }

}
