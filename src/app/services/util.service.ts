import { Injectable }       from '@angular/core';
import { EnvService }       from './env.service';
import { Http, Headers }    from '@angular/http';
import { Router }           from '@angular/router';
import { CookieService }    from 'ngx-cookie-service';
import * as pe              from 'parse-error';
import { environment }      from '../../environments/environment';


@Injectable()
export class UtilService {
  env:any;
  constructor(private router: Router, private http: Http, private cookieService:CookieService, private envService:EnvService) {
    this.env = this.envService;
  }
  use(){
    console.log('using util service');
    //does nothing this is to get rid of the error that it is never used
  }
  getAuthToken(){
    return this.cookieService.get('token');
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

  async post(url, data){
    console.log('test')
    var headers = new Headers();
    if(url[0]=='/'){
      url = this.getApiUrl()+url;
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', this.getAuthToken());
    }

    let err, res, send;
    [err, res] = await this.to(this.http.post(url, data, { headers: headers }).toPromise(), false);
    if(err) send = err;
    if(res) send = res;

    return JSON.parse(send._body);
  }

  async put(url, data){
    var headers = new Headers();
    if(url[0]=='/'){
      url = this.getApiUrl()+url;
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', this.getAuthToken());
    }

    let err, res, send;
    [err, res] = await this.to(this.http.put(url, data, { headers: headers }).toPromise(), false);
    if(err) send = err;
    if(res) send = res;

    return JSON.parse(send._body);
  }

  async patch(url, data){
    var headers = new Headers();
    if(url[0]=='/'){
      url = this.getApiUrl()+url;
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', this.getAuthToken());
    }
    let err, res, send;
    [err, res] = await this.to(this.http.patch(url, data, { headers: headers }).toPromise(), false);

    if(err) send = err;
    if(res) send = res;

    return JSON.parse(send._body);
  }
  async delete(url){
    var headers = new Headers();
    if(url[0]=='/'){
      url = this.getApiUrl()+url;
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', this.getAuthToken());
    }
    let err, res, send;
    [err, res] = await this.to(this.http.delete(url, { headers: headers }).toPromise(), false);

    if(err) send = err;
    if(res) send = res;

    return JSON.parse(send._body);
  }

  async get(url){
    var headers = new Headers();
    if(url[0]=='/'){
      url = this.getApiUrl()+url;
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', this.getAuthToken());
    }

    let err, res, send;
    [err, res] = await this.to(this.http.get(url, { headers: headers }).toPromise(), false);

    if(err) send = err;
    if(res) send = res;

    return JSON.parse(send._body);
  }

  capFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

}
