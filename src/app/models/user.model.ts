import { Injectable }       from '@angular/core';
import { Model }            from 'bamfstore';
import { UtilService }      from './../services/util.service';
import { AppModule }        from './../app.module';

@Injectable()
export class User extends Model {
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
  }

  util;
  // util = new UtilService(Router, Http, CookieService, EnvService);
  constructor(){
    super();

    //this is the only maintainable way for model to use outside services
    this.util = AppModule.injector.get(UtilService); //https://stackoverflow.com/questions/39101865/angular-2-inject-dependency-outside-constructor
  }

  apiUpdateValues = ['email', 'phone'];

  fullname(){
    return this.first + ' ' + this.last;
  }

  static Auth(){
    return this.findOne({auth:true});
  }

  async save(){
    let err, res:any;

    let update_data = {};

    for (let i in this.apiUpdateValues){
      let value = this.apiUpdateValues[i]
      if(this[value]) update_data[value] = this[value];
    }
    console.log(update_data);

    [err, res] = await this.util.to(this.util.put('/v1/users', update_data ));

    if(err){
      console.log(err);
      return err;
    }

    if(!res.success){
      console.log(res.message);
      return res.message;
    }

    super.save();//calls the parent model method and saves it in storage
  }


}
