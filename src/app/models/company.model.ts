import { Model }            from 'browser-model';
// import { Model }            from './model';
import { UtilService }      from './../services/util.service';
import { AppInjector }      from './../app.module';
import { User }             from './user.model';
import * as _               from 'underscore';

export class Company extends Model {
  apiUpdateValues:Array<string> = ['name'];//these are the values that will be sent to the API

  _id;
  name;

  static SCHEMA = {
    _id:{type:'string', primary:true},//this means every time you make a new object you must give it a _id
    name:{type:'string'},
    user_ids:[{type:'string'}],
  };

  util;


  constructor(obj:object){
    super(obj);
    //this is the only maintainable way for model to use outside services
    //this is what causes the ciurcular dependency warning, however this will not cause any errors
    this.util        = AppInjector.get(UtilService); //https://stackoverflow.com/questions/39101865/angular-2-inject-dependency-outside-constructor
  }

  Users(){
    return this.belongsToMany(User, 'user_ids', '_id', true);
  }

  to(action){
    return this.util.route('/company/'+action+'/'+this._id);
  }

  routeMain(){
    return this.util.route('/company/update/'+this._id);
  }

  //Static
  static get util(){
    return AppInjector.get(UtilService);
  }

  static async getAllAuthCompanies(){
    let err, res;
    [err, res] = await this.util.to(this.util.get('/v1/companies'));
    if(err) this.util.TE(err.message, true);
    if(!res.success) this.util.TE(res.error, true);

    let companies = []
    for(let i in res.companies){
      let company_info = res.companies[i];
      let company = this.resCreate(company_info);
      companies.push(company);
    }

    return companies;
  }

  static resCreate(res_company){//create company instance from a company response
    let company = this.findById(res_company._id);
    if(company) return company;

    let company_info = res_company;
    let user_ids = company_info.users.map(user=>user.user);
    company_info.user_ids = user_ids;

    company = this.create(company_info);
    return company;
  }

  static async CreateAPI(companyInfo:any){
    let err, res;
    [err, res] = await this.util.to(this.util.post('/v1/companies', companyInfo));
    if(err) this.util.TE(err.message, true);
    if(!res.success) this.util.TE(res.error, true);

    let company = this.resCreate(res.company);
    company.emit(['newly-created'], companyInfo, true);
    return company;
  }

  static async getById(id:string){
    let company = this.findById(id);
    if(company) return company;

    let err, res; //get from API
    [err, res] = await this.util.to(this.util.get('/v1/companies/'+id));
    if(err) this.util.TE(err.message, true);
    if(!res.success) this.util.TE(res.error, true);

    let company_info = res.company;
    company = this.resCreate(res.company);
    return company;
  }

}
