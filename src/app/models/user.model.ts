import { Model } from 'bamfstore';

export class User extends Model {
  first;
  last;
  static SCHEMA = {
    _id:{type:'string', primary:true},
    first:{type:'string'},
    last:{type:'string'},
  }


  fullname(){
    return this.first + ' ' + this.last;
  }



}
