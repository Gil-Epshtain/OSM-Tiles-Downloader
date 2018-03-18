
// Angular
import { Component, OnInit, OnChanges, Input } from '@angular/core';

// Leaflet
import * as L from 'leaflet';

// Application
import { StringsService } from './../../services/strings/strings.service';

const mapZoom = 11;
const mapCenter =
{
  lat: 40.788,
  lng: -73.962
};

@Component({
  selector: 'app-map-preview',
  templateUrl: './map-preview.component.html',
  styleUrls: ['./map-preview.component.scss']
})
export class MapPreviewComponent implements OnInit, OnChanges
{
  @Input() mapServer: string;

  private _strings: any;

  private _tileLayer: L.TileLayer;

  public constructor(private _stringsService: StringsService) 
  {
    console.log("Map-Preview.component - ctor");
  }

  public ngOnInit() 
  {
    this._strings = this._stringsService.strings;

    this._initMap();
  }

  public ngOnChanges(changes: any): void
  {
    if (!changes.mapServer.firstChange &&
         changes.mapServer.currentValue !== changes.mapServer.previousValue)
    {
      this._updateMapServer();
    }    
  }

  private _initMap(): void
  {
    let mapHandler = L.map('mapPreview').setView([mapCenter.lat, mapCenter.lng], mapZoom);

    this._tileLayer = L.tileLayer(this.mapServer + "/{z}/{x}/{y}.png",
    {
      attribution: this._stringsService.strings._OsmTilesDownloader_,
    }).addTo(mapHandler);
  }

  private _updateMapServer(): void
  { 
    this._tileLayer.setUrl(this.mapServer + "/{z}/{x}/{y}.png");
  }
}