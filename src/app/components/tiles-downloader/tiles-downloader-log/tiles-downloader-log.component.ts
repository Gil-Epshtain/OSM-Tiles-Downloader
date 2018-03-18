// Angular
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

// Application
import { StringsService } from './../../../services/strings/strings.service';
import { LogService, ILogMessage, eLogLevel } from './../../../services/log/log.service';
import { Element } from '@angular/compiler';

@Component({
  selector: 'app-tiles-downloader-log',
  templateUrl: './tiles-downloader-log.component.html',
  styleUrls: ['./tiles-downloader-log.component.scss']
})
export class TilesDownloaderLogComponent implements OnInit
{
  @ViewChild("logBoard") logBoard: ElementRef

  private _strings: any;

  public constructor(
    private _stringsService: StringsService,
    private _logService: LogService)
  {
    console.log("Tiles-Downloader-Log.component - ctor");
  }

  public ngOnInit() 
  {
    this._strings = this._stringsService.strings;
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

    this._scrollToBottom();

    return retMessageColor;
  }

  private _scrollToBottom(): void
  {
    this.logBoard.nativeElement.scrollIntoView(false);
  }
}