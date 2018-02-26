import { AppInjector }      from './../app.module';
import { environment }      from '../../environments/environment';

export class Env {

  constructor(){
  }

  static _app_name:string;
  static _app_first:string;
  static _app_second:string;

  //************************************
  //********* STATIC METHODS ***********
  //************************************

  static get app_first():string{
    return this.app_name.split(' ')[0];
  }

  static get app_second():string{
    let name = '';
    if(this.app_name.split(' ').length > 1){
      name = this.app_name.split(' ').slice(1).join(' ');
    }

    return name;
  }

  static set app_name(name:string){
    this._app_name = name;
    this._app_first = name.split(' ')[0];
    if(name.split(' ').length > 1){
      this._app_second = name.split(' ').slice(1).join(' ');
    }
  }

  static get app_name(): string{
    if(!this._app_name) {
      this.app_name = environment.app_name;
    }
    return this._app_name;
  }

}
