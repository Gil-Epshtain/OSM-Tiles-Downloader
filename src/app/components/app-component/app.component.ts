// Angular
import { Component, OnInit } from '@angular/core';

// Application
import { StringsService }   from './../../services/strings/strings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit 
{
  public constructor(private _stringsService: StringsService) 
  {
    console.log("App.component - ctor");
  }
  
  public ngOnInit()
  {
    this._stringsService.setLocal('en-US');
  }
}