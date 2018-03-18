// Angular
import { Injectable } from '@angular/core';

// Application
export enum eLogLevel
{
  info,
  success,
  warning,
  error
}

export interface ILogMessage
{
  text: string;
  logLevel: eLogLevel;
}

@Injectable()
export class LogService 
{  
  private _messages: ILogMessage[];

  public constructor()
  {
    console.log("Log.service - ctor");

    this.clearLog();
  }
 
  public get messages(): ILogMessage[]
  {
    return this._messages;
  }

  public addMessage(message: string, logLevel: eLogLevel = eLogLevel.info): void
  {
    this._messages.push({
      text: message,
      logLevel: logLevel
    });
  }
 
  public clearLog(): void
  {
    this._messages = [];
  }
}