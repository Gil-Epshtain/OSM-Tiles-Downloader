// Angular
import { Component, OnInit } from '@angular/core';

// Application
import { StringsService }         from './../../services/strings/strings.service';
import { LogService, eLogLevel }  from './../../services/log/log.service';
import { 
  IInputDate,
  parametersRange, 
  serversList,
  TilesDownloaderService
} from './../../services/tiles-downloader/tiles-downloader.service';

@Component({
  selector: 'app-tiles-downloader',
  templateUrl: './tiles-downloader.component.html',
  styleUrls: ['./tiles-downloader.component.scss']
})
export class TilesDownloaderComponent implements OnInit
{
  public strings: any;

  // Data from Service
  private _MIN_ZOOM: number = parametersRange.minZoom;
  private _MAX_ZOOM: number = parametersRange.maxZoom;
  private _MIN_LAT:  number = parametersRange.minLat;
  private _MAX_LAT:  number = parametersRange.maxLat;
  private _MIN_LNG:  number = parametersRange.minLng;
  private _MAX_LNG:  number = parametersRange.maxLng;
  
  // User Input
  public serversList: any[];
  public selectedServer: any;
  public downloadType: string;
  public zoomLevel: number;
  public north:     number;
  public west:      number;
  public east:      number;
  public south:     number;
  public xStart:    number;
  public xEnd:      number;
  public yStart:    number;
  public yEnd:      number;

  public constructor(
    private _stringsService: StringsService,
    private _logService: LogService,
    private _tilesDownloaderService: TilesDownloaderService)
  {
    console.log("Tiles-Downloader-Config.component - ctor");
  }

  public ngOnInit() 
  {
    this.strings = this._stringsService.strings;

    this._initInput();
  }

  private _initInput(): void
  {
    this.serversList = serversList;
    this.selectedServer = this.serversList[0];

    this.downloadType = "latlng";

    this.zoomLevel = this._MIN_ZOOM;

    this.north     = this._MAX_LAT;
    this.west      = this._MIN_LNG;
    this.east      = this._MAX_LNG;
    this.south     = this._MIN_LAT;

    this.xStart    = 0;
    this.xEnd      = 0;
    this.yStart    = 0;
    this.yEnd      = 0;
  }

  private _readInput(): IInputDate
  {
    let inputData: IInputDate,
        isInputValid: boolean;

    if (this.downloadType === "latlng")
    {
      inputData = this._readInputLatLng();
      isInputValid = this._validateInputLatLng(inputData);
    }
    else if (this.downloadType === "xy")
    {
      inputData = this._readInputXY();
      isInputValid = this._validateInputXY(inputData);
    }

    return isInputValid ? inputData : null;
  }

  private _readInputLatLng(): IInputDate
  {
    return {
      serverUrl: this.selectedServer.url,
      downloadType: this.downloadType,
      zoom: this.zoomLevel,
      boundingBox:
      {
        north: this.north,
        west:  this.west,
        east:  this.east,
        south: this.south
      }
    };
  }

  private _readInputXY(): IInputDate
  {
    return {
      serverUrl: this.selectedServer.url,
      downloadType: this.downloadType,
      zoom: this.zoomLevel,
      xyRange:
      {
        X:
        {
          start:  this.xStart,
          end:    this.xEnd
        },
        Y:
        {
          start:  this.yStart,
          end:    this.yEnd
        }
      }
    };
  }

  private _validateInputLatLng(inputData: IInputDate): boolean
  {
    let isInputValid = true;

    if (this._MIN_ZOOM <= inputData.zoom && inputData.zoom < this._MAX_ZOOM &&
        this._MIN_LAT <= inputData.boundingBox.north && inputData.boundingBox.north <= this._MAX_LAT &&
        this._MIN_LAT <= inputData.boundingBox.south && inputData.boundingBox.south <= this._MAX_LAT &&
        this._MIN_LNG <= inputData.boundingBox.west  && inputData.boundingBox.west  <= this._MAX_LNG &&
        this._MIN_LNG <= inputData.boundingBox.east  && inputData.boundingBox.east  <= this._MAX_LNG &&
        inputData.boundingBox.south < inputData.boundingBox.north && 
        inputData.boundingBox.west  < inputData.boundingBox.east)
    {
      isInputValid = true;
    }
    else
    {
      this._logService.addMessage(this.strings._IllegalInput_, eLogLevel.error);

      if (inputData.boundingBox.north <= inputData.boundingBox.south) // North < South
      {
        this._logService.addMessage(`${ this.strings._North_ } ${ this.strings._ValueNeedToBeBigger_ } ${ this.strings._South_ } ${ this.strings._Value_ }.`, eLogLevel.error);        
      }

      if (inputData.boundingBox.east  <= inputData.boundingBox.west) // East < West
      {
        this._logService.addMessage(`${ this.strings._East_ } ${ this.strings._ValueNeedToBeBigger_ } ${ this.strings._West_ } ${ this.strings._Value_ }.`, eLogLevel.error);        
      }

      if (inputData.zoom < this._MIN_ZOOM || this._MAX_ZOOM < inputData.zoom) // Zoom Range
      {
        this._logService.addMessage(`${ this.strings._ZoomLevel_ } ${ this.strings._ValueNeedToBeInRange_ } [${ this._MIN_ZOOM }-${ this._MAX_ZOOM }].`, eLogLevel.error);
      }

      if (inputData.boundingBox.north < this._MIN_LAT || this._MAX_LAT < inputData.boundingBox.north) // North Range
      {
        this._logService.addMessage(`${ this.strings._North_ } ${ this.strings._ValueNeedToBeInRange_ } [${ this._MIN_LAT }-${ this._MAX_LAT }].`, eLogLevel.error);
      }

      if (inputData.boundingBox.west  < this._MIN_LNG || this._MAX_LNG < inputData.boundingBox.west) // West Range
      {
        this._logService.addMessage(`${ this.strings._West_ } ${ this.strings._ValueNeedToBeInRange_ } [${ this._MIN_LNG }-${ this._MAX_LNG }].`, eLogLevel.error);
      }

      if (inputData.boundingBox.east  < this._MIN_LNG || this._MAX_LNG < inputData.boundingBox.east) // East Range
      {
        this._logService.addMessage(`${ this.strings._East_ } ${ this.strings._ValueNeedToBeInRange_ } [${ this._MIN_LNG }-${ this._MAX_LNG }].`, eLogLevel.error);
      }

      if (inputData.boundingBox.south < this._MIN_LAT || this._MAX_LAT < inputData.boundingBox.south) // South Range
      {
        this._logService.addMessage(`${ this.strings._South_ } ${ this.strings._ValueNeedToBeInRange_ } [${ this._MIN_LAT }-${ this._MAX_LAT }].`, eLogLevel.error);
      }

      isInputValid = false;
    }

    return isInputValid;
  }

  private _validateInputXY(inputData: IInputDate): boolean
  {
    let isInputValid = true;

    let max = Math.pow(2, inputData.zoom) - 1;

    if (this._MIN_ZOOM <= inputData.zoom && inputData.zoom < this._MAX_ZOOM &&
        0 <= inputData.xyRange.X.start && inputData.xyRange.X.start <= max &&
        0 <= inputData.xyRange.X.end   && inputData.xyRange.X.end   <= max &&
        0 <= inputData.xyRange.Y.start && inputData.xyRange.Y.start <= max &&
        0 <= inputData.xyRange.Y.end   && inputData.xyRange.Y.end   <= max &&
        inputData.xyRange.X.start <= inputData.xyRange.X.end && 
        inputData.xyRange.Y.start <= inputData.xyRange.Y.end)
    {
      isInputValid = true;
    }
    else
    {
      this._logService.addMessage(this.strings._IllegalInput_, eLogLevel.error);

      if (inputData.xyRange.X.end < inputData.xyRange.X.start) // xEnd < xStart
      {
        this._logService.addMessage(`${ this.strings._XEnd_ } ${ this.strings._ValueNeedToBeEqual_ } ${ this.strings._XStart_ } ${ this.strings._Value_ }.`, eLogLevel.error);        
      }

      if (inputData.xyRange.Y.end < inputData.xyRange.Y.start) // yEnd < yStart
      {
        this._logService.addMessage(`${ this.strings._YEnd_ } ${ this.strings._ValueNeedToBeEqual_ } ${ this.strings._YStart_ } ${ this.strings._Value_ }.`, eLogLevel.error);        
      }

      if (inputData.zoom < this._MIN_ZOOM || this._MAX_ZOOM < inputData.zoom) // Zoom Range
      {
        this._logService.addMessage(`${ this.strings._ZoomLevel_ } ${ this.strings._ValueNeedToBeInRange_ } [${ this._MIN_ZOOM }-${ this._MAX_ZOOM }].`, eLogLevel.error);
      }

      if (inputData.xyRange.X.start < 0 || max < inputData.xyRange.X.start) // X-Start Range
      {
        this._logService.addMessage(`${ this.strings._XStart_ } ${ this.strings._ValueNeedToBeInRange_ } [0-${ max }].`, eLogLevel.error);
      }

      if (inputData.xyRange.X.end   < 0 || max < inputData.xyRange.X.end) // X-End Range
      {
        this._logService.addMessage(`${ this.strings._XEnd_ } ${ this.strings._ValueNeedToBeInRange_ } [0-${ max }].`, eLogLevel.error);
      }

      if (inputData.xyRange.Y.start < 0 || max < inputData.xyRange.Y.start) // Y-Start Range
      {
        this._logService.addMessage(`${ this.strings._YStart_ } ${ this.strings._ValueNeedToBeInRange_ } [0-${ max }].`, eLogLevel.error);
      }

      if (inputData.xyRange.Y.end   < 0 || max < inputData.xyRange.Y.end) // Y-End Range
      {
        this._logService.addMessage(`${ this.strings._YEnd_ } ${ this.strings._ValueNeedToBeInRange_ } [0-${ max }].`, eLogLevel.error);
      }

      isInputValid = false;
    }

    return isInputValid;
  }

  public onKeyDown(event: any): void
  {
    if (event.keyCode === 13) // Enter
    {
      this.download();
    }    
  }

  public analyze(): void
  {
    console.log("Tiles-Downloader-Config.component - analyze");

    this._logService.clearLog();
    this._logService.addMessage(`------------------------ ${ this.strings._Analyze_ } ------------------------`);

    let inputData: IInputDate = this._readInput();
    if (inputData)
    {
      this._tilesDownloaderService.analyzeTiles(inputData);
    }
    else
    {
      this._logService.addMessage(`${ this.strings._TileAnalysis_ } ${ this.strings._CanceledIllegalInput_ }`);
    }
  }

  public download(): void
  {
    console.log("Tiles-Downloader-Config.component - download");
    
    this._logService.clearLog();
    this._logService.addMessage(`------------------------ ${ this.strings._Download_ } ------------------------`);

    let inputData: IInputDate = this._readInput();
    if (inputData)
    {
      this._tilesDownloaderService.downloadTiles(inputData);
    }
    else
    {
      this._logService.addMessage(`${ this.strings._DownloadFlow_ } ${ this.strings._CanceledIllegalInput_ }`);
    }
  }

  public abort(): void
  {
    console.log("Tiles-Downloader-Config.component - abort");

    this._tilesDownloaderService.abortDownload();
  }
}