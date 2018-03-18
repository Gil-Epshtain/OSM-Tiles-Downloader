// Angular
import { Component, OnInit } from '@angular/core';

// Application
import { StringsService } from './../../services/strings/strings.service';

import { 
  TilesDownloaderService,
  IInputDate,
  ITileData
} from './../../services/tiles-downloader/tiles-downloader.service';

@Component({
  selector: 'app-tiles-downloader',
  templateUrl: './tiles-downloader.component.html',
  styleUrls: ['./tiles-downloader.component.scss']
})
export class TilesDownloaderComponent implements OnInit
{
  private _strings: any;

  public constructor(
    private _stringsService: StringsService,
    private _tilesDownloaderService: TilesDownloaderService) 
  {
    console.log("Tiles-Downloader.component - ctor");
  }

  public ngOnInit() 
  {
    this._strings = this._stringsService.strings;
  }

  private _onAnalyze(inputDate: IInputDate): void
  {
    console.log("Tiles-Downloader.component - _onAnalyze");

    this._tilesDownloaderService.analyzeTiles(inputDate);
  }

  private _onDownload(inputDate: IInputDate): void
  {
    console.log("Tiles-Downloader.component - _onDownload");

    this._tilesDownloaderService.downloadTiles(inputDate);
  }

  private _onAbort(): void
  {
    console.log("Tiles-Downloader.component - _onAbort");

    this._tilesDownloaderService.abortDownload();
  }
}