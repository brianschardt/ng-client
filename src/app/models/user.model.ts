import { Model }            from 'bamfstore';
// import { Model }           from './model';
import { UtilService }      from './../services/util.service';
import { AppInjector }      from './../app.module';
import * as _               from 'underscore';

export class User extends Model {
  apiUpdateValues:Array<string> = ['email', 'phone'];//these are the values that will be sent to the API

  first;
  last;
  auth;
  token;
  email;
  phone;

  // public util: UtilService = new UtilService;
  static SCHEMA = {
    _id:{type:'string', primary:true},
    first:{type:'string'},
    last:{type:'string'},
    email:{type:'string'},
    phone:{type:'string'},
    auth:{type:'boolean'},
    token:{type:'string'},
  };

  util;
  constructor(){
    super();
    //this is the only maintainable way for model to use outside services
    //this is what causes the ciurcular dependency warning, however this will not cause any errors
    this.util        = AppInjector.get(UtilService); //https://stackoverflow.com/questions/39101865/angular-2-inject-dependency-outside-constructor
    // this.userService = AppInjector.get(UserService);
  }

  fullname(){
    return this.first + ' ' + this.last;
  }

  static Auth(){
    let user:User = <User> this.findOne({auth:true});
    return user;
  }

  logout(){
    this.remove();
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

    this.save();
  }


}
