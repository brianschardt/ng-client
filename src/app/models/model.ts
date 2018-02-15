import * as _ from 'browser-model';

export class Model{

  public static model_name:string;
  public static all_data:Array<object>;
  public static SCHEMA:Object;

  constructor(obj_data:any){
    (<any>Object).assign(this, obj_data);
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

  uniqueIdName(){
    return (this.constructor as any).getPrimaryKey();
  }

  uniqueId(){
    let unique_name = this.uniqueIdName();
    return (<any> this)[unique_name];
  }

  save(){
    let query_obj = this.uniqueQueryIdentifier();
    let update_object = this.toObject();
    (this.constructor as any).findOneAndUpdate(query_obj, update_object, {upsert:true});
    this.emitEvent(['save']);
    // return (this.constructor as any).instantiateObject(update_object);
  }

  remove(){
    let query_obj = this.uniqueQueryIdentifier();
    (this.constructor as any).removeInstance(query_obj);
    (this.constructor as any).remove(query_obj);
    this.emitEvent(['remove']);
  }

  reload(){//updates instance storage from browser data
    let model = (this.constructor as any).findById(this.uniqueId(), true);
    let obj = model.toObject();
    (<any>Object).assign(this, obj);
    this.emitEvent(['reload']);
  }

  getStorageValues(){
    let name:any = this.uniqueIdName();
    let id:any = (<any> this)[name];
    return (this.constructor as any).findById(id, true).toObject();
  }

  getInstanceValues(){
    return this.toObject();
  }

  getPropertyDifferences(){
    let instance = this.getInstanceValues();
    let storage = this.getStorageValues();
    return (this.constructor as any).difference(instance, storage);
  }

  storageDifference(){
    let diff = this.getPropertyDifferences();
    let storage = this.getStorageValues();

    let storage_differences = _.pick(storage, (value:any, key:any, object:any)=>{
      return diff.includes(key);
    })

    return storage_differences;
  }

  instanceDifference(){
    let diff = this.getPropertyDifferences();
    let instance = this.getInstanceValues();

    let instance_differences = _.pick(instance, (value:any, key:any, object:any)=>{
      return diff.includes(key);
    })

    return instance_differences;
  }

  //**************************************************
  //*********** STATIC *******************************
  //**************************************************
  static _instances: Array<Model> = [];

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
    this._instances = [];
    this.emitEvent(['remove']);
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
      }else{
        new_data[key] = '';
      }
    }

    return new_data
  }

  //singe means that this object does not share a data reference to anywhere else
  static instantiateObject(obj_data:any, single?:boolean){//this gets it so the object has the same reference and thus data in components
    let obj:any
    if(typeof single !== "undefined" && single === true){
      obj =  new this(obj_data);
      return obj
    }

    let primary_key = this.getPrimaryKey();
    obj = this._instances.filter((instance:any)=>instance[primary_key] === obj_data[primary_key])[0];

    if(!obj){
      obj =  new this(obj_data);
      this._instances.push(obj);
    }

    return obj
  }

  static create(data:any, single?:boolean){
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
    let inst_obj = this.instantiateObject(instance, single);

    this.emitEvent(['create']);
    return inst_obj;
  }


  static removeInstance(search:object){//Removes instance from the app storage
    this._instances = this._instances.filter(instance=>{
      let obj = instance.toObject();
      return !_.isMatch(obj, search)
    })
  }


  static removeStorage(search:object){//Removes instance from browser storage
    let all_data = this.getAllData();
    let new_data = all_data.filter((data:object)=>{ return !_.isMatch(data, search)});
    this.setAllData(new_data);
  }

  static remove(search:object){
    this.removeStorage(search);
    this._change.forEach((listener: any) => listener());
  }

  static update(search:object, new_data?:any, single?:boolean){
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
      this.create(instance, single);
    }

  }

  static updateOne(search:object, new_data:any, single?:boolean){
    let all_data:any = this.getAllData();
    let instance:any = all_data.filter((data:any)=>{ return _.isMatch(data, search)})[0];
    if(!instance){
      return null;
    }
    this.remove(search);
    for (let o in new_data){
      instance[o] = new_data[o]
    }
    return this.create(instance, single);
  }

  static findOne(search?:object, single?:boolean){
    let all_data = this.getAllData();
    let instance;
    if(!search){
      instance = all_data[0];
    }else{
      instance = all_data.filter((data:object)=>{ return _.isMatch(data, search);})[0];
    }
    if(typeof instance === 'undefined' || !instance) return null;

    instance = this.instantiateObject(instance, single)
    return instance;
  }

  static find(search:object, single?:boolean){
    let all_data = this.getAllData();
    let instances = all_data.filter((data:object)=>{ return _.isMatch(data, search);});
    let final_objs = instances;
    let array = []
    for (let i in final_objs){
      let instance = final_objs[i];
      instance = this.instantiateObject(instance, single)
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
          final_obj = this.create(search, options.single);
        }else{
          final_obj = this.create(data, options.single);
        }
      }else{
        null;
      }
    }else{
      final_obj = this.updateOne(search, data, options.single)
    }
    return final_obj;
  }

  static findById(id:string, single?:boolean){
    let primary_key:any = this.getPrimaryKey();
    let obj:any = {};
    obj[primary_key] = id;
    return this.findOne(obj, single);
  }

  static difference(a:any, b:any){
    let diff =  _.reduce(a, function(result:any, value:any, key:any) {
      return _.isEqual(value, b[key]) ?
        result : result.concat(key);
    }, []);
    return diff;
  }

  //**********************************************************
  //************* EVENTS *************************************
  //**********************************************************

  //Global Model Events
  static _create:any = [];
  static _remove:any = [];
  static _update:any = [];
  static _change:any = [];

  static onCreate(listener:any){
    this._create.push(listener);
    return ()=>{
      this._create = this._create.filter((l:any) => l !== listener)
    }
  }

  static onRemove(listener:any){
    this._remove.push(listener);
    return ()=>{
      this._remove = this._remove.filter((l:any) => l !== listener)
    }
  }

  static onUpdate(listener:any){
    this._update.push(listener);
    return ()=>{
      this._update = this._update.filter((l:any) => l !== listener)
    }
  }

  static onChange(listener:any){
    this._change.push(listener);
    return ()=>{
      this._change = this._change.filter((l:any) => l !== listener)
    }
  }

  static emitEvent(array:Array<string>){
    for ( let i in array){
      let kind = array[i];
      switch (kind){
        case 'create':
          this._create.forEach((listener: any) => listener());
          this._change.forEach((listener: any) => listener());
          break;
        case 'update':
          this._update.forEach((listener: any) => listener());
          this._change.forEach((listener: any) => listener());
          break;
        case 'remove':
          this._remove.forEach((listener: any) => listener());
          this._change.forEach((listener: any) => listener());
          break;
      }
    }
  }

  //Instance Model Events
  _save  :any = [];
  _remove:any = [];
  _reload:any = [];
  _change:any = [];

  onSave(listener:any){
    this._save.push(listener);
    return ()=>{
      this._save = this._save.filter((l:any) => l !== listener)
    }
  }

  onRemove(listener:any){
    this._remove.push(listener);
    return ()=>{
      this._remove = this._remove.filter((l:any) => l !== listener)
    }
  }

  onReload(listener:any){
    this._reload.push(listener);
    return ()=>{
      this._reload = this._reload.filter((l:any) => l !== listener)
    }
  }

  onChange(listener:any){
    this._change.push(listener);
  }

  on(event_name:string, callback?:any){
    switch(event_name){
      case 'save':
        return this.onSave(callback);
        break;
      case 'remove':
        return this.onRemove(callback);
        break;
      case 'reload':
        return this.onReload(callback);
        break;
      case 'change':
        return this.onChange(callback);
        break;
    }
  }
  emitEvent(array:Array<string>){
    for ( let i in array){
      let kind = array[i];
      switch (kind){
        case 'save':
          this._save.forEach((listener: any)   => listener());
          this._change.forEach((listener: any) => listener());
          break;
        case 'remove':
          this._remove.forEach((listener: any) => listener());
          this._change.forEach((listener: any) => listener());
          break;
        case 'reload':
          this._reload.forEach((listener: any) => listener());
          break;
      }
    }
  }
}
