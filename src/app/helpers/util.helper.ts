import { AppInjector }      from './../app.module';
import * as pe              from 'parse-error';
import { Http, Headers }    from '@angular/http';
import { environment }      from '../../environments/environment';
import { User }             from './../models/user.model';
import { FacebookService, InitParams, LoginOptions } from 'ngx-facebook';
import { Router }           from '@angular/router';

export class Util {

  constructor(){
  }


  //************************************
  //********* Dependencies *************
  //************************************

  static get router(){
    return AppInjector.get(Router);
  }

  static get http(){
    return AppInjector.get(Http);
  }

  //************************************

  static getUrlParams(aroute:any){
    return new Promise(resolve=>{
      aroute.params.subscribe( params => resolve(params) );
    })
  }

  static to(promise, parse?) {//global function that will help use handle promise rejections, this article talks about it http://blog.grossman.io/how-to-write-async-await-without-try-catch-blocks-in-javascript/
    return promise.then(data => {
      return [null, data];
    }).catch(err => {
      if(parse===false) return [err];
      return [pe(err)]
    });
  }

  static TE = function(err_message:string, log?:boolean){ // TE stands for Throw Error
    if(log === true){
      console.error(err_message);
    }

    throw new Error(err_message);
  }

  static route(uri){
    this.router.navigate([uri]);
  }

  static getApiUrl(){
    return environment.apiUrl;
  }

  static apiHeaders(headers:any){
    headers.append('Content-Type', 'application/json');
    let user:User = <User> User.Auth();
    if(user){
      let token:string = user.token;
      headers.append('Authorization', token);
    }
    return headers;
  }

  static responder(err, res){
    let send;
    if (err) send = err;
    if (res) send = res;
    return JSON.parse(send._body);
  }

  static async post(url, data){
    var headers = new Headers();
    if(url[0]=='/'){
      url = this.getApiUrl()+url;
      headers = this.apiHeaders(headers);
    }

    let err, res;
    [err, res] = await this.to(this.http.post(url, data, { headers: headers }).toPromise(), false);
    return this.responder(err, res);
  }

  static async put(url, data){
    console.log('put');
    var headers = new Headers();
    if(url[0]=='/'){
      url = this.getApiUrl()+url;
      headers = this.apiHeaders(headers);
    }

    let err, res;
    [err, res] = await this.to(this.http.put(url, data, { headers: headers }).toPromise(), false);
    return this.responder(err, res);
  }

  static async patch(url, data){
    var headers = new Headers();
    if(url[0]=='/'){
      url = this.getApiUrl()+url;
      headers = this.apiHeaders(headers);
    }
    let err, res;
    [err, res] = await this.to(this.http.patch(url, data, { headers: headers }).toPromise(), false);
    return this.responder(err, res);
  }

  static async delete(url){
    var headers = new Headers();
    if(url[0]=='/'){
      url = this.getApiUrl()+url;
      headers = this.apiHeaders(headers);
    }
    let err, res;
    [err, res] = await this.to(this.http.delete(url, { headers: headers }).toPromise(), false);
    return this.responder(err, res);
  }

  static async get(url){
    var headers = new Headers();
    if(url[0]=='/'){
      url = this.getApiUrl()+url;
      headers = this.apiHeaders(headers);
    }

    let err, res;
    [err, res] = await this.to(this.http.get(url, { headers: headers }).toPromise(), false);
    return this.responder(err, res);
  }

  static capFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


}
