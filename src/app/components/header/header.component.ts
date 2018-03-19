// Angular
import { Component, OnInit } from '@angular/core';

// Application
import { StringsService } from './../../services/strings/strings.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit
{
  public strings: any;

  public constructor(private _stringsService: StringsService) 
  {
    console.log("Header.component - ctor");
  }

  public ngOnInit() 
  {
    this.strings = this._stringsService.strings;
  }
}