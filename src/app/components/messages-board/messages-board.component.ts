// Angular
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

// Application
import { LogService, ILogMessage, eLogLevel } from './../../services/log/log.service';

@Component({
  selector: 'app-messages-board',
  templateUrl: './messages-board.component.html',
  styleUrls: ['./messages-board.component.scss']
})
export class MessagesBoardComponent implements OnInit
{
  @ViewChild("msgBoard") msgBoard: ElementRef

  public constructor(public logService: LogService)
  {
    console.log("Messages-Board.component - ctor");
  }

  public ngOnInit() 
  {
  }

  private _getMessageColor(logLevel: eLogLevel): string
  {
    let retMessageColor: string;
    switch(logLevel)
    {
      case eLogLevel.info:
        retMessageColor = '#42b5fa';
        break;
      case eLogLevel.success:
        retMessageColor = '#00ff00';
        break;
      case eLogLevel.warning:
        retMessageColor = '#ffff00';
        break;
      case eLogLevel.error:
        retMessageColor = '#ff0000';
        break;
    }

    return retMessageColor;
  }
}