import { UtilService }      from './../services/util.service';
import { AppInjector }      from './../app.module';
import * as _               from 'underscore';
import { LoginOptions }     from 'ngx-facebook';
import {Util}                 from './util.helper';

export class API {

  constructor(){
  }


  //************************************
  //********* STATIC METHODS ***********
  //************************************

  static get util(){
    return AppInjector.get(UtilService);
  }

  static async save(model, uri:string, update_data?:any){
    let err, res:any;

    if(!update_data){
      let differences = model.instanceDifference();
      if(_.isEmpty(differences)) Util.TE('Nothing Updated');
      update_data = _.pick(differences, (value, key, object) => model.apiUpdateValues.includes(key) );
      if(_.isEmpty(update_data)) Util.TE('Nothing Updated');
    }

    [err, res] = await Util.to(Util.put(uri, update_data ));

    if(err) Util.TE(err, true);
    if(!res.success) Util.TE(res.error, true);

    model.emit('saveApi', update_data, true);
    model.save();
    return true;
  }


}
