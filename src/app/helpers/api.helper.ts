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

  static async remove(model, uri:string){
    let err, res:any;

    [err, res] = await Util.to(Util.delete(uri));

    if(err) Util.TE(err, true);

    model.emit('removeApi', {}, true);
    model.remove();
    return true;
  }


}
