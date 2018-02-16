import { Model }            from 'browser-model';
// import { Model }            from './model';
import { UtilService }      from './../services/util.service';
import { AppInjector }      from './../app.module';
import * as _               from 'underscore';
import { LoginOptions } from 'ngx-facebook';

//interfaces
import { LoginInfo }      from './../interfaces/login-info';

export class User extends Model {
  apiUpdateValues:Array<string> = ['email', 'phone', 'first', 'last'];//these are the values that will be sent to the API

  first;
  last;
  auth;
  token;
  email;
  phone;

  static SCHEMA = {
    _id:{type:'string', primary:true},//this means every time you make a new object you must give it a _id
    first:{type:'string'},
    last:{type:'string'},
    email:{type:'string'},
    phone:{type:'string'},
    auth:{type:'boolean'},
    token:{type:'string'},
  };

  util;
  constructor(obj:object){
    super(obj);
    //this is the only maintainable way for model to use outside services
    //this is what causes the ciurcular dependency warning, however this will not cause any errors
    this.util        = AppInjector.get(UtilService); //https://stackoverflow.com/questions/39101865/angular-2-inject-dependency-outside-constructor
  }

  set full_name(name:string){
    let split = name.split(' ');
    this.first = split[0];
    this.last = split[1];
  }

  get full_name(){
    let full_name = '';
    if(this.first) full_name = `${full_name}${this.first}`;
    if(this.last) full_name = `${full_name} ${this.last}`;
    return full_name;
  }

  logout(){
    this.remove();
    this.util.route('/home');
    this.emit(['logout', 'auth'], 'logout', true);
  }

  async saveAPI(){
    let err, res:any;
    let update_data = {};

    let differences = this.instanceDifference();

    if(_.isEmpty(differences)) this.util.TE('Nothing Updated');

    update_data = _.pick(differences, (value, key, object) => this.apiUpdateValues.includes(key) );

    if(_.isEmpty(update_data)) this.util.TE('Nothing Updated');

    [err, res] = await this.util.to(this.util.put('/v1/users', update_data ));

    if(err) this.util.TE(err, true);
    if(!res.success) this.util.TE(res.error, true);

    this.emit('saveApi', update_data, true);
    this.save();
  }


  //************************************
  //********* STATIC METHODS ***********
  //************************************

  static get util(){
    return AppInjector.get(UtilService);
  }

  static get fb(){
    return this.util.fb;
  }

  static Auth(){
    let user:User = <User> this.findOne({auth:true});
    return user;
  }

  static Login(info: LoginInfo){
    // this.setAuthToken(info.token);
    info.user.auth = true;
    info.user.token = info.token;
    let user = <User> User.create(info.user);
    user.emit(['login', 'auth'], 'login', true);
    return user;
  }

  static async LoginReg(data: Object){
    let res:any;
    let err;
    [err, res] = await this.util.to(this.util.post('/v1/users/login', data));

    if(err) this.util.TE(err, true);

    if(!res.success) this.util.TE(res.error, true);

    var login_info: LoginInfo = {
      token: res.token,
      user: res.user,
    };

    let user = this.Login(login_info);
    return user;
  }

  static async CreateAccount(data:Object){
    let err, res:any;
    [err, res] = await this.util.to(this.util.post('/v1/users', data));

    if(err) this.util.TE(err, true);
    if(!res.success) this.util.TE(res.error, true);

    var login_info: LoginInfo = {
      token: res.token,
      user: res.user,
    };

    let user = this.Login(login_info);
    return user;
  }

  static async LoginSocial(service: String){
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

    let user;
    if(!err) user = this.Login(login_info);

    if(!user) this.util.TE('Error loggin user in', true);
    return user
  }

}
