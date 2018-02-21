import { Injectable }       from '@angular/core';
import { EnvService }       from './env.service';
import { Http, Headers }    from '@angular/http';
import { Router }           from '@angular/router';
import { CookieService }    from 'ngx-cookie-service';
import * as pe              from 'parse-error';
import { environment }      from '../../environments/environment';
import { User }             from './../models/user.model';
import { FacebookService, InitParams, LoginOptions } from 'ngx-facebook';

@Injectable()
export class UtilService {
  env:any;

  constructor(private router: Router, private http: Http, private cookieService:CookieService, private envService:EnvService, public fb: FacebookService) {
    this.env = this.envService;
    let initParams: InitParams = {
      appId: this.env.facebook_app_id,
      xfbml: true,
      version: 'v2.8'
    };
    this.fb.init(initParams);
  }
  use(){
    console.log('using util service');
    //does nothing this is to get rid of the error that it is never used
  }

  setlocalStorage(name:string, data:Object){
    localStorage.setItem(name, JSON.stringify(data));
  }

  getlocalStorage(name:string): Object{
    return JSON.parse(localStorage.getItem(name));
  }

  removeLocalStorage(name: string){
    localStorage.removeItem(name);
  }

  getUrlParams(aroute:any){
    return new Promise(resolve=>{
      aroute.params.subscribe( params => resolve(params) );
    })
  }

  to(promise, parse?) {//global function that will help use handle promise rejections, this article talks about it http://blog.grossman.io/how-to-write-async-await-without-try-catch-blocks-in-javascript/
    return promise.then(data => {
      return [null, data];
    }).catch(err => {
      if(parse===false) return [err];
      return [pe(err)]
    });
  }

  TE = function(err_message:string, log?:boolean){ // TE stands for Throw Error
    if(log === true){
      console.error(err_message);
    }

    throw new Error(err_message);
  }

  route(uri){
    this.router.navigate([uri]);
  }

  getApiUrl(){
    return environment.apiUrl;
  }

  apiHeaders(headers:any){
    headers.append('Content-Type', 'application/json');
    let user:User = <User> User.Auth();
    if(user){
      let token:string = user.token;
      headers.append('Authorization', token);
    }
    return headers;
  }

  responder(err, res){
    let send;
    if (err) send = err;
    if (res) send = res;
    return JSON.parse(send._body);
  }

  async post(url, data){
    var headers = new Headers();
    if(url[0]=='/'){
      url = this.getApiUrl()+url;
      headers = this.apiHeaders(headers);
    }

    let err, res;
    [err, res] = await this.to(this.http.post(url, data, { headers: headers }).toPromise(), false);
    return this.responder(err, res);
  }

  async put(url, data){
    var headers = new Headers();
    if(url[0]=='/'){
      url = this.getApiUrl()+url;
      headers = this.apiHeaders(headers);
    }

    let err, res;
    [err, res] = await this.to(this.http.put(url, data, { headers: headers }).toPromise(), false);
    return this.responder(err, res);
  }

  async patch(url, data){
    var headers = new Headers();
    if(url[0]=='/'){
      url = this.getApiUrl()+url;
      headers = this.apiHeaders(headers);
    }
    let err, res;
    [err, res] = await this.to(this.http.patch(url, data, { headers: headers }).toPromise(), false);
    return this.responder(err, res);
  }

  async delete(url){
    var headers = new Headers();
    if(url[0]=='/'){
      url = this.getApiUrl()+url;
      headers = this.apiHeaders(headers);
    }
    let err, res;
    [err, res] = await this.to(this.http.delete(url, { headers: headers }).toPromise(), false);
    return this.responder(err, res);
  }

  async get(url){
    var headers = new Headers();
    if(url[0]=='/'){
      url = this.getApiUrl()+url;
      headers = this.apiHeaders(headers);
    }

    let err, res;
    [err, res] = await this.to(this.http.get(url, { headers: headers }).toPromise(), false);
    return this.responder(err, res);
  }

  capFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

}
