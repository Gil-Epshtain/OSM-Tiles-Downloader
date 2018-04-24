// Angular
import { Injectable } from '@angular/core';

// Application
import { StringsService }        from './../strings/strings.service';
import { LogService, eLogLevel } from './../log/log.service';
import { FileDownloaderService } from './../file-downloader/file-downloader.service';

export interface IInputDate
{
  serverUrl: string;
  downloadType: string;
  zoom: number;
  boundingBox?:
  {
    north: number;
    west:  number;
    east:  number;
    south: number;
  }
  xyRange?:
  {
    X:
    {
      start: number;
      end:   number;
    },
    Y:
    {
      start: number;
      end:   number;
    }
  }
}

export interface ITileData
{
  xStart: number;
  xEnd  : number;
  yStart: number;
  yEnd  : number;
  tilesCount?: number
}

export const parametersRange =
{
  minZoom: 0,
  maxZoom: 19,
  minLat: -85.0511,
  maxLat: 85.0511,
  minLng: -180,
  maxLng: 180
};

export const serversList =
[
  // OpenStreetMap
  {
    name: "OpenStreetMap",
    url: "https://tile.openstreetmap.org",
    urlRegEx: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  },
  // Wikimedia Maps
  {
    name: "Wikimedia Maps",
    url: "https://maps.wikimedia.org/osm-intl",
    urlRegEx: "https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png"
  },
  // OpenCycleMap
  {
    name: "OpenCycleMap",
    url: "http://tile.opencyclemap.org/cycle",
    urlRegEx: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png"
  },
  // Humanitarian
  {
    name: "Humanitarian Map",
    url: "http://tile.openstreetmap.fr/hot",
    urlRegEx: "http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
  },
  // Hike & Bike
  {
    name: "Hike & Bike",
    url: "http://toolserver.org/tiles/hikebike",
    urlRegEx: "http://toolserver.org/tiles/hikebike/{z}/{x}/{y}.png"
  },
  // OSM B&W
  {
    name: "OSM B&W",
    url: "http://tiles.wmflabs.org/bw-mapnik",
    urlRegEx: "https://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
  },
  // OSM no labels
  {
    name: "OSM no labels",
    url: "http://tiles.wmflabs.org/osm-no-labels",
    urlRegEx: "https://{s}.tiles.wmflabs.org/osm-no-labels/{z}/{x}/{y}.png"
  },
  // Stamen Toner
  {
    name: "Stamen Toner",
    url: "http://tile.stamen.com/toner",
    urlRegEx: "http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png"
  },
  // Stamen Watercolor
  {
    name: "Stamen Watercolor",
    url: "http://tile.stamen.com/watercolor",
    urlRegEx: "http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg"
  },
  // Transport Map
  {
    name: "Transport Map",
    url: "http://tile2.opencyclemap.org/transport",
    urlRegEx: "http://{s}.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png"
  },
  // Thunderforest Landscape
  {
    name: "Thunderforest Landscape",
    url: "http://tile.thunderforest.com/landscape",
    urlRegEx: "http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png"
  },
  // Thunderforest Outdoors
  {
    name: "Thunderforest Outdoors",
    url: "http://tile.thunderforest.com/outdoors",
    urlRegEx: "http://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png"
  },
  // Carto - Voyager
  {
    name: "Carto - Voyager",
    url: "https://basemaps.cartocdn.com/rastertiles/voyager",
    urlRegEx: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
  },
  // Carto - Positron
  {
    name: "Carto - Light",
    url: "http://basemaps.cartocdn.com/light_all",
    urlRegEx: "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
  },
  // Carto - Dark Matter
  {
    name: "Carto - Dark",
    url: "https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all",
    urlRegEx: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
  },
  // Carto - World Antique
  {
    name: "Carto - World Antique",
    url: "https://cartocdn_a.global.ssl.fastly.net/base-antique",
    urlRegEx: "https://cartocdn_{s}.global.ssl.fastly.net/base-antique/{z}/{x}/{y}.png"
  },
  // Carto - World Eco
  {
    name: "Carto - Eco",
    url: "https://cartocdn_a.global.ssl.fastly.net/base-eco",
    urlRegEx: "https://cartocdn_{s}.global.ssl.fastly.net/base-eco/{z}/{x}/{y}.png"
  },
  // Carto - World Flat Blue
  {
    name: "Carto - Flat Blue",
    url: "https://cartocdn_a.global.ssl.fastly.net/base-flatblue",
    urlRegEx: "https://cartocdn_{s}.global.ssl.fastly.net/base-flatblue/{z}/{x}/{y}.png"
  },
  // Carto - World Midnight Commander
  {
    name: "Carto - Midnight",
    url: "https://cartocdn_a.global.ssl.fastly.net/base-midnight",
    urlRegEx: "https://cartocdn_{s}.global.ssl.fastly.net/base-midnight/{z}/{x}/{y}.png"
  },
];

@Injectable()
export class TilesDownloaderService
{  
  private _isAbortDownload: boolean;

  public constructor(
    private _stringsService: StringsService,
    private _logService: LogService,
    private _fileDownloaderService: FileDownloaderService)
  {
    console.log("File-Downloader.service - ctor");
  }

  public analyzeTiles(inputData: IInputDate): ITileData
  {
    let tilesData: ITileData;
    if (inputData.downloadType === "latlng")
    {
      tilesData =
      {
        xStart: this._lng2tile(inputData.boundingBox.west,  inputData.zoom),
        xEnd  : this._lng2tile(inputData.boundingBox.east,  inputData.zoom),
        yStart: this._lat2tile(inputData.boundingBox.north, inputData.zoom),
        yEnd  : this._lat2tile(inputData.boundingBox.south, inputData.zoom)
      }; 
    }
    else if (inputData.downloadType === "xy")
    {
      tilesData =
      {
        xStart: inputData.xyRange.X.start,
        xEnd  : inputData.xyRange.X.end,
        yStart: inputData.xyRange.Y.start,
        yEnd  : inputData.xyRange.Y.end
      };
    }    

    let xCount = Math.abs(tilesData.xEnd - tilesData.xStart) + 1,
        yCount = Math.abs(tilesData.yEnd - tilesData.yStart) + 1;

    tilesData.tilesCount = xCount * yCount;

    this._logService.addMessage(`${ this._stringsService.strings._TilesCount_ }: ${ tilesData.tilesCount }. ${ this._stringsService.strings._TilesRange_ } [X: ${ tilesData.xStart }-${ tilesData.xEnd }, Y: ${ tilesData.yStart }-${ tilesData.yEnd }].`);    

    return tilesData;
  }
  
  public async downloadTiles(inputData: IInputDate): Promise<any>
  {
    const tilesData: ITileData = this.analyzeTiles(inputData);

    if(confirm(`${ this._stringsService.strings._YouAreAboutToDownload_ } ${ tilesData.tilesCount } ${ this._stringsService.strings._TilesAreYouSure_ }`))
    {
      this._isAbortDownload = false;

      let index = 0;
      let errors: string[] = [];
      let startTime = new Date().getTime();

      for (let x = tilesData.xStart; x <= tilesData.xEnd; x++)
      {
        for (let y = tilesData.yStart; y <= tilesData.yEnd; y++)
        {
          if (this._isAbortDownload)
          {
            this._writeDownloadEndedMessage(this._stringsService.strings._DownloadAbortedByUser_, index, tilesData.tilesCount, startTime, errors);
            
            return;
          }
          else
          {
            let tileUrl = `${ inputData.serverUrl }/${ inputData.zoom }/${ x }/${ y }.png`;
            let fileName = `tile_${ inputData.zoom }_${ x }_${ y }.png`;
            this._logService.addMessage(`${ this._stringsService.strings._DownloadTile_ } [${ ++index }/${ tilesData.tilesCount }] - ${ tileUrl }`);

            try
            {
              let result = await this._fileDownloaderService.downloadFile(tileUrl, fileName);
              this._logService.addMessage(result, eLogLevel.success);
            }
            catch(e)
            {
              this._logService.addMessage(e, eLogLevel.error);
              errors.push(e);
            }
          }
        }
      }

      this._writeDownloadEndedMessage(this._stringsService.strings._DownloadCompleted_, tilesData.tilesCount - errors.length, tilesData.tilesCount, startTime, errors);
    } 
    else
    {      
      this._logService.addMessage(this._stringsService.strings._DownloadAbortedByUser_)
    }
  }

  private _writeDownloadEndedMessage(
    downloadStatus: string,
    downloadCount: number, 
    tilesCount: number,
    startTime: number, 
    errors: string[])
  {
    this._logService.addMessage(`------------------------ ${ this._stringsService.strings._DownloadEnded_ } ------------------------`);

    let successRate = parseFloat((downloadCount * 100 / tilesCount).toFixed(2));
    let duration = this._timeToString((new Date().getTime()) - startTime);
    
    let message = `${ downloadStatus } [${ downloadCount } ${ this._stringsService.strings._OutOf_ } ${ tilesCount } - ${ successRate }% ${ this._stringsService.strings._Success_ }; ${ errors.length } ${ this._stringsService.strings._Errors_ }; in ${ duration }]`;

    if (errors.length === 0)
    {
      this._logService.addMessage(message, eLogLevel.success);
    }
    else
    {
      errors.forEach(error => this._logService.addMessage(error, eLogLevel.error));
      this._logService.addMessage(this._stringsService.strings._TilesFailedToDownload_, eLogLevel.warning);
      this._logService.addMessage(message, eLogLevel.warning);
    }
  }

  public abortDownload(): void
  {
    this._isAbortDownload = true;
  }

  private _timeToString(time: number): string
  {
    let ms: number = time % 1000;
    time = Math.floor(time / 1000);

    let sec: number = time % 60;
    let secStr: string = (sec < 10) ? '0' + sec : sec.toString();
    time = Math.floor(time / 60);    

    let min: number = time % 60;
    let minStr = (min < 10) ? '0' + min : min.toString();
    time = Math.floor(time / 60);

    let hour: number = time;

    return `${ hour }:${ minStr }:${ secStr }`;
  }

  // Convert (Lat, Lng) To Tile (X, Y) - Read more at https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Zoom_levels
  private _lng2tile(lng: number, zoom: number): number
  { 
    return (Math.floor((lng + 180) / 360 * Math.pow(2, zoom))); 
  }

  private _lat2tile(lat: number, zoom: number): number
  { 
    return (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1/ Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom))); 
  }
}