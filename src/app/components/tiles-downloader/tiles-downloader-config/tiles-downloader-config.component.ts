// Angular
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

// Application
import { StringsService }         from './../../../services/strings/strings.service';
import { LogService, eLogLevel }  from './../../../services/log/log.service';

import { 
  IInputDate,
  parametersRange, 
  serversList
} from './../../../services/tiles-downloader/tiles-downloader.service';

@Component({
  selector: 'app-tiles-downloader-config',
  templateUrl: './tiles-downloader-config.component.html',
  styleUrls: ['./tiles-downloader-config.component.scss']
})
export class TilesDownloaderConfigComponent implements OnInit
{
  @Output() onAnalyze:  EventEmitter<IInputDate>;
  @Output() onDownload: EventEmitter<IInputDate>;
  @Output() onAbort:    EventEmitter<any>;

  private _strings: any;

  private _serversList: any[];
  private _MIN_ZOOM: number = parametersRange.minZoom;
  private _MAX_ZOOM: number = parametersRange.maxZoom;
  private _MIN_LAT:  number = parametersRange.minLat;
  private _MAX_LAT:  number = parametersRange.maxLat;
  private _MIN_LNG:  number = parametersRange.minLng;
  private _MAX_LNG:  number = parametersRange.maxLng;

  private _selectedServer: any;
  private _downloadType: string;
  private _zoomLevel: number;
  private _north:     number;
  private _west:      number;
  private _east:      number;
  private _south:     number;
  private _xStart:    number;
  private _xEnd:      number;
  private _yStart:    number;
  private _yEnd:      number;

  public constructor(
    private _stringsService: StringsService,
    private _logService: LogService)
  {
    console.log("Tiles-Downloader-Config.component - ctor");

    this.onAnalyze  = new EventEmitter<IInputDate>();
    this.onDownload = new EventEmitter<IInputDate>();
    this.onAbort    = new EventEmitter<any>();
  }

  public ngOnInit() 
  {
    this._strings = this._stringsService.strings;

    this._initInput();
  }

  private _initInput(): void
  {
    this._serversList = serversList;
    this._selectedServer = this._serversList[0];

    this._downloadType = "latlng";

    this._zoomLevel = this._MIN_ZOOM;

    this._north     = this._MAX_LAT;
    this._west      = this._MIN_LNG;
    this._east      = this._MAX_LNG;
    this._south     = this._MIN_LAT;

    this._xStart    = 0;
    this._xEnd      = 0;
    this._yStart    = 0;
    this._yEnd      = 0;
  }

  private _readInput(): IInputDate
  {
    let inputData: IInputDate,
        isInputValid: boolean;

    if (this._downloadType === "latlng")
    {
      inputData = this._readInputLatLng();
      isInputValid = this._validateInputLatLng(inputData);
    }
    else if (this._downloadType === "xy")
    {
      inputData = this._readInputXY();
      isInputValid = this._validateInputXY(inputData);
    }

    return isInputValid ? inputData : null;
  }

  private _readInputLatLng(): IInputDate
  {
    return {
      serverUrl: this._selectedServer.url,
      downloadType: this._downloadType,
      zoom: this._zoomLevel,
      boundingBox:
      {
        north: this._north,
        west:  this._west,
        east:  this._east,
        south: this._south
      }
    };
  }

  private _readInputXY(): IInputDate
  {
    return {
      serverUrl: this._selectedServer.url,
      downloadType: this._downloadType,
      zoom: this._zoomLevel,
      xyRange:
      {
        X:
        {
          start:  this._xStart,
          end:    this._xEnd
        },
        Y:
        {
          start:  this._yStart,
          end:    this._yEnd
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
      this._logService.addMessage(this._strings._IllegalInput_, eLogLevel.error);

      if (inputData.boundingBox.north <= inputData.boundingBox.south) // North < South
      {
        this._logService.addMessage(`${ this._strings._North_ } ${ this._strings._ValueNeedToBeBigger_ } ${ this._strings._South_ } ${ this._strings._Value_ }.`, eLogLevel.error);        
      }

      if (inputData.boundingBox.east  <= inputData.boundingBox.west) // East < West
      {
        this._logService.addMessage(`${ this._strings._East_ } ${ this._strings._ValueNeedToBeBigger_ } ${ this._strings._West_ } ${ this._strings._Value_ }.`, eLogLevel.error);        
      }

      if (inputData.zoom < this._MIN_ZOOM || this._MAX_ZOOM < inputData.zoom) // Zoom Range
      {
        this._logService.addMessage(`${ this._strings._ZoomLevel_ } ${ this._strings._ValueNeedToBeInRange_ } [${ this._MIN_ZOOM }-${ this._MAX_ZOOM }].`, eLogLevel.error);
      }

      if (inputData.boundingBox.north < this._MIN_LAT || this._MAX_LAT < inputData.boundingBox.north) // North Range
      {
        this._logService.addMessage(`${ this._strings._North_ } ${ this._strings._ValueNeedToBeInRange_ } [${ this._MIN_LAT }-${ this._MAX_LAT }].`, eLogLevel.error);
      }

      if (inputData.boundingBox.west  < this._MIN_LNG || this._MAX_LNG < inputData.boundingBox.west) // West Range
      {
        this._logService.addMessage(`${ this._strings._West_ } ${ this._strings._ValueNeedToBeInRange_ } [${ this._MIN_LNG }-${ this._MAX_LNG }].`, eLogLevel.error);
      }

      if (inputData.boundingBox.east  < this._MIN_LNG || this._MAX_LNG < inputData.boundingBox.east) // East Range
      {
        this._logService.addMessage(`${ this._strings._East_ } ${ this._strings._ValueNeedToBeInRange_ } [${ this._MIN_LNG }-${ this._MAX_LNG }].`, eLogLevel.error);
      }

      if (inputData.boundingBox.south < this._MIN_LAT || this._MAX_LAT < inputData.boundingBox.south) // South Range
      {
        this._logService.addMessage(`${ this._strings._South_ } ${ this._strings._ValueNeedToBeInRange_ } [${ this._MIN_LAT }-${ this._MAX_LAT }].`, eLogLevel.error);
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
      this._logService.addMessage(this._strings._IllegalInput_, eLogLevel.error);

      if (inputData.xyRange.X.end < inputData.xyRange.X.start) // xEnd < xStart
      {
        this._logService.addMessage(`${ this._strings._XEnd_ } ${ this._strings._ValueNeedToBeEqual_ } ${ this._strings._XStart_ } ${ this._strings._Value_ }.`, eLogLevel.error);        
      }

      if (inputData.xyRange.Y.end < inputData.xyRange.Y.start) // yEnd < yStart
      {
        this._logService.addMessage(`${ this._strings._YEnd_ } ${ this._strings._ValueNeedToBeEqual_ } ${ this._strings._YStart_ } ${ this._strings._Value_ }.`, eLogLevel.error);        
      }

      if (inputData.zoom < this._MIN_ZOOM || this._MAX_ZOOM < inputData.zoom) // Zoom Range
      {
        this._logService.addMessage(`${ this._strings._ZoomLevel_ } ${ this._strings._ValueNeedToBeInRange_ } [${ this._MIN_ZOOM }-${ this._MAX_ZOOM }].`, eLogLevel.error);
      }

      if (inputData.xyRange.X.start < 0 || max < inputData.xyRange.X.start) // X-Start Range
      {
        this._logService.addMessage(`${ this._strings._XStart_ } ${ this._strings._ValueNeedToBeInRange_ } [0-${ max }].`, eLogLevel.error);
      }

      if (inputData.xyRange.X.end   < 0 || max < inputData.xyRange.X.end) // X-End Range
      {
        this._logService.addMessage(`${ this._strings._XEnd_ } ${ this._strings._ValueNeedToBeInRange_ } [0-${ max }].`, eLogLevel.error);
      }

      if (inputData.xyRange.Y.start < 0 || max < inputData.xyRange.Y.start) // Y-Start Range
      {
        this._logService.addMessage(`${ this._strings._YStart_ } ${ this._strings._ValueNeedToBeInRange_ } [0-${ max }].`, eLogLevel.error);
      }

      if (inputData.xyRange.Y.end   < 0 || max < inputData.xyRange.Y.end) // Y-End Range
      {
        this._logService.addMessage(`${ this._strings._YEnd_ } ${ this._strings._ValueNeedToBeInRange_ } [0-${ max }].`, eLogLevel.error);
      }

      isInputValid = false;
    }

    return isInputValid;
  }

  public analyze(): void
  {
    console.log("Tiles-Downloader-Config.component - analyze");

    this._logService.clearLog();
    this._logService.addMessage(`${ this._strings._Analyze_ }:`);

    let inputData: IInputDate = this._readInput();
    if (inputData)
    {
      this.onAnalyze.emit(inputData);
    }
    else
    {
      this._logService.addMessage(`${ this._strings._TilesAnalysis_ } ${ this._strings._CanceledIllegalInput_ }`);
    }
  }

  public download(): void
  {
    console.log("Tiles-Downloader-Config.component - download");
    
    this._logService.clearLog();
    this._logService.addMessage(`${ this._strings._Download_ }:`);

    let inputData: IInputDate = this._readInput();
    if (inputData)
    {
      this.onDownload.emit(inputData);
    }
    else
    {
      this._logService.addMessage(`${ this._strings._DownloadFlow_ } ${ this._strings._CanceledIllegalInput_ }`);
    }
  }

  public abort(): void
  {
    console.log("Tiles-Downloader-Config.component - abort");

    this.onAbort.emit();
  }
}