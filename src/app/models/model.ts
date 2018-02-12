import * as _ from 'underscore';


export class Model{

  public static model_name:string;
  public static all_data:Array<object>;
  public static SCHEMA:Object;

  constructor(){

  }

  getModelName(){
    return (this.constructor as any).getModelName();
  }


  toObject(){
    let properties = Object.getOwnPropertyNames(this);
    let obj:any = {};
    for ( let i in properties){
      let property:any = properties[i];
      obj[property] = (<any> this)[property]
    }

    return obj
  }

  uniqueQueryIdentifier(){
    let primary_id = (this.constructor as any).getPrimaryKey();
    let query_obj:any = {};
    query_obj[primary_id] = (<any> this)[primary_id];
    return query_obj;
  }
  save(){
    let query_obj = this.uniqueQueryIdentifier();
    let update_object = this.toObject();
    (this.constructor as any).updateOne(query_obj, update_object);
    // return (this.constructor as any).instantiateObject(update_object);
  }

  remove(){
    let query_obj = this.uniqueQueryIdentifier();
    (this.constructor as any).remove(query_obj);
  }
  //Static
  static describe(): Array<string> {
    let properties = Object.getOwnPropertyNames(this);
    properties = properties.splice(3);
    return properties;
  }

  static setlocalStorage(name:string, data:Object){
    localStorage.setItem(name, JSON.stringify(data));
  }

  static getlocalStorage(name:string): Object{
    return JSON.parse(localStorage.getItem(name) || '[]');
  }

  static removeLocalStorage(name: string){
    localStorage.removeItem(name);
  }

  static getModelName(){
    if(!this.model_name) this.model_name = this.toString().split ('(' || /s+/)[0].split (' ' || /s+/)[1];
    return this.model_name;
  }

  static removeAllData(){
    let model_name = this.getModelName();
    this.removeLocalStorage(model_name);
  }

  static setAllData(data: Array<Object>){
    let model_name = this.getModelName();
    this.setlocalStorage(model_name, data);
  }

  static getAllData(){
    let model_name = this.getModelName();
    let data: any = this.getlocalStorage(model_name);
    if(!data){
      data = [];
      this.setAllData(data);
    }

    return data;
  }

  static getPrimaryKey(){
    let schema:any = this.SCHEMA;
    let primary_key = 'id';
    for (let key in schema){
      let prop = schema[key];
      if(typeof prop==='object'){
        for(let i in prop){
          let eprop = prop[i];
          if(i === 'primary' && eprop === true){
            primary_key = key;
          }
        }
      }
    }
    return primary_key;
  }

  static getSchema(){
    let schema:any = this.SCHEMA;
    if(!schema[this.getPrimaryKey()]){
      schema['id'] = {type:'number', primary:true}
    }
    return schema;
  }
  static schemaValidate(data: any){
    let schema:any = this.getSchema();
    let new_data:any = {};
    for ( let key in schema){
      if(data[key]){
        new_data[key] = data[key]
      }
    }

    return new_data
  }

  static instantiateObject(obj_data:any){
    let obj =  new this();
    (<any>Object).assign(obj, obj_data);
    return obj
  }

  static create(data:any){
    let old_data: Array<Object> = this.getAllData();

    let instance = this.schemaValidate(data);

    let primary_key = this.getPrimaryKey();
    if(!instance[primary_key]){
      let id:any = 1;
      if(old_data.length!=0){
        id = Math.max.apply(Math,old_data.map(function(o:any){return o[primary_key];}))
        id++;
      }
      instance[primary_key] = id;
    }

    old_data.push(instance);
    this.setAllData(old_data);
    let inst_obj = this.instantiateObject(instance);
    return inst_obj;
  }


  static remove(search:object){
    let all_data = this.getAllData();
    let new_data = all_data.filter((data:object)=>{ return !_.isMatch(data, search)});
    this.setAllData(new_data);
  }

  static update(search:object, new_data?:any){
    let all_data = this.getAllData();
    let instances = all_data.filter((data:object)=>{ return _.isMatch(data, search)});
    if(!instances){
      return null;
    }

    this.remove(search);
    for( let i in instances){
      let instance:any = instances[i];
      for (let o in new_data){
        instance[o] = new_data[o]
      }
      this.create(instance);
    }

  }

  static updateOne(search:object, new_data:any){
    let all_data:any = this.getAllData();
    let instance:any = all_data.filter((data:any)=>{ return _.isMatch(data, search)})[0];
    if(!instance){
      return null;
    }
    this.remove(search);
    for (let o in new_data){
      instance[o] = new_data[o]
    }
    return this.create(instance);
  }

  static findOne(search?:object){
    let all_data = this.getAllData();
    let instance;
    if(!search){
      instance = all_data[0];
    }else{
      instance = all_data.filter((data:object)=>{ return _.isMatch(data, search);})[0];
    }
    instance = this.instantiateObject(instance)
    return instance;
  }

  static find(search:object){
    let all_data = this.getAllData();
    let instances = all_data.filter((data:object)=>{ return _.isMatch(data, search);});
    let final_objs = instances;
    let array = []
    for (let i in final_objs){
      let instance = final_objs[i];
      instance = this.instantiateObject(instance)
      array.push(instance);
    }

    return array;
  }

  static findOneAndUpdate(search:object, data?:any, options?:any){
    if(typeof search !== 'object'){ console.log('search wrong') }
    let all_data = this.getAllData();
    let instance = all_data.filter((data:object)=>{ return _.isMatch(data, search);})[0];
    let final_obj = instance;
    if(!instance){
      if(typeof options === 'object' && options.upsert === true){
        if(_.isEmpty(data)){
          final_obj = this.create(search);
        }else{
          final_obj = this.create(data);
        }
      }else{
        null;
      }
    }else{
      final_obj = this.updateOne(search, data)
    }
    return final_obj;
  }

  static findById(id:string){
    let primary_key:any = this.getPrimaryKey();
    let obj:any = {};
    obj[primary_key] = id;
    return this.findOne(obj);
  }
}
