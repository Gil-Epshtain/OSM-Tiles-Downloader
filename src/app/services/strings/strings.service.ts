// Angular
import { Injectable } from '@angular/core';

// Lodash
import* as _ from 'lodash';

// Application
import * as enUS from './local/en-US.json';

@Injectable()
export class StringsService
{
  private _string: any;
  private _language: any;

  public constructor() 
  {
    console.log("Strings.service - ctor");

    this._loadStrings();
  }

  private _loadStrings(): void
  {
    this._string = 
    {
      "en-US": enUS
    };

    this._language = null;
  }

  public setLocal(local: string): StringsService
  {
    console.log(`Strings.component - setLocal [local: ${local}]`);
    
    this._language = _.find(this._string, (value, key) => key == local) || this._language;

    return this;
  }

  public get strings(): any
  {
    return this._language;
  }
}