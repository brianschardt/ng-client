// import { Model }            from 'browser-model';
import { Model }            from './model';
import { User }             from './user.model';
import * as _               from 'underscore';
import { API }              from './../helpers/api.helper';
import { Util }             from './../helpers/util.helper';

export class Company extends Model {
  apiUpdateValues:Array<string> = ['name'];//these are the values that will be sent to the API

  _id;
  name;

  static SCHEMA = {
    _id:{type:'string', primary:true},//this means every time you make a new object you must give it a _id
    name:{type:'string'},
    test:{name:{type:'string'}},
    users:[{user:{type:'string'}, permissions:[{type:'string'}]}],
  };

  constructor(obj:object){
    super(obj);
  }

  Users(){
    return this.belongsToMany(User, 'users.user', '_id', true);
  }

  to(action){
    return Util.route('/company/'+action+'/'+this._id);
  }

  async saveAPI(){
    return API.save(this, '/v1/companies/'+this._id);
  }

  async removeAPI(){
    return API.remove(this, '/v1/companies/'+this._id);
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
    let company = this.findById(res_company._id);
    if(company) return company;

    let company_info = res_company;

    // let user_ids = company_info.users.map(user=>user.user);
    // company_info.user_ids = user_ids;

    company_info.users = company_info.users

    company_info.test = {name:'test'};

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
