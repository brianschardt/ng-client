import { Injectable } from '@angular/core';
import { environment }  from '../../environments/environment';

@Injectable()
export class EnvService {
  _app_name:string;
  _app_first:string;
  _app_second:string;
  constructor() {
    console.log('setting up env');
    this.app_name = environment.app_name;
  }

  get app_first():string{
    if(!this._app_first) return 'First';
    return this._app_first;
  }

  get app_second():string{
    if(!this._app_second) return '';
    return this._app_second;
  }

  set app_name(name:string){
    this._app_name = name
    this._app_first = name.split(' ')[0];
    if(name.split(' ').length > 1){
      this._app_second = name.split(' ').slice(1).join(' ');
    }
  }

  get app_name(): string{
    if(this._app_name) return this._app_name;
    return 'App Name Not Set';
  }
}
