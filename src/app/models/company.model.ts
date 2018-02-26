import { Model }            from 'browser-model';
// import { Model }            from './model';
import { User }             from './user.model';
import * as _               from 'underscore';
import { API }              from './../helpers/api.helper';
import { Util }             from './../helpers/util.helper';

export class Company extends Model {
  apiUpdateValues:Array<string> = ['name'];//these are the values that will be sent to the API

  id;
  name;

  static SCHEMA = {
    id:{type:'string', primary:true},//this means every time you make a new object you must give it a _id
    name:{type:'string'},
    test:{name:{type:'string'}},
    users:[{user:{type:'string'}, permissions:[{type:'string'}]}],
  };

  constructor(obj:object){
    super(obj);
  }

  Users(){
    return this.belongsToMany(User, 'users.user', 'id', true);
  }

  to(action){
    return Util.route('/company/'+action+'/'+this.id);
  }

  async saveAPI(){
    return API.save(this, '/v1/companies/'+this.id);
  }

  async removeAPI(){
    return API.remove(this, '/v1/companies/'+this.id);
  }

  //Static

  static to(action){
    return Util.route('/company/'+action);
  }

  static async getAllAuthCompanies(){
    let err, res;
    [err, res] = await Util.to(Util.get('/v1/companies'));
    if(err) Util.TE(err.message, true);
    if(!res.success) Util.TE(res.error, true);

    let companies = []
    for(let i in res.companies){
      let company_info = res.companies[i];
      let company = this.resCreate(company_info);
      companies.push(company);
    }

    return companies;
  }

  static resCreate(res_company){//create company instance from a company response
    let company = this.findById(res_company.id);
    if(company) return company;
    let company_info = res_company;
    company_info.id = res_company.id;

    company_info.users = res_company.users;

    company = this.create(company_info);
    return company;
  }

  static async CreateAPI(companyInfo:any){
    let err, res;
    [err, res] = await Util.to(Util.post('/v1/companies', companyInfo));
    if(err) Util.TE(err.message, true);
    if(!res.success) Util.TE(res.error, true);
    let company = this.resCreate(res.company);
    company.emit(['newly-created'], companyInfo, true);
    return company;
  }

  static async getById(id:string){
    let company = this.findById(id);
    if(company) return company;

    let err, res; //get from API
    [err, res] = await Util.to(Util.get('/v1/companies/'+id));
    if(err) Util.TE(err.message, true);
    if(!res.success) Util.TE(res.error, true);

    let company_info = res.company;
    company = this.resCreate(res.company);
    return company;
  }

}
