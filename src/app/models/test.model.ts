import { Injectable }       from '@angular/core';
import { Model }            from 'bamfstore';
import { UtilService }      from './../services/util.service';


@Injectable()
export class Test{
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

  constructor(private util:UtilService){}

  apiUpdateValues = ['email', 'phone'];

  fullname(){
    return this.first + ' ' + this.last;
  }


  async save(){
    let err, res:any;

    let update_data = {};

    this.util.use();
  }


}
