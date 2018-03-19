// Angular
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit 
{
  public constructor()
  {
    console.log("Main.component - ctor");
  }

  public ngOnInit() 
  {
  }
}