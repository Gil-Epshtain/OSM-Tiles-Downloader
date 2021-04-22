// *** Angular ***
import { BrowserModule }                    from '@angular/platform-browser';
import { BrowserAnimationsModule }          from '@angular/platform-browser/animations';
import { NgModule }                         from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule }                 from '@angular/common/http';

// *** Material Design ***
import { MatFormFieldModule }               from '@angular/material/form-field';
import { MatInputModule }                   from '@angular/material/input';
import { MatRadioModule }                   from '@angular/material/radio';
import { MatSelectModule }                  from '@angular/material/select';
import { MatButtonModule }                  from '@angular/material/button';
import { MatTooltipModule }                 from '@angular/material/tooltip';

// *** Application ***

// Services
import { StringsService }                   from './services/strings/strings.service';
import { LogService }                       from './services/log/log.service';
import { FileDownloaderService }            from './services/file-downloader/file-downloader.service';
import { TilesDownloaderService }           from './services/tiles-downloader/tiles-downloader.service';

// Component
import { AppComponent }                     from './components/app-component/app.component';
import { MainComponent }                    from './components/main/main.component';
import { HeaderComponent }                  from './components/header/header.component';

import { TilesDownloaderComponent }         from './components/tiles-downloader/tiles-downloader.component';
import { MessagesBoardComponent }           from './components/messages-board/messages-board.component';
import { MapPreviewComponent }              from './components/map-preview/map-preview.component';

@NgModule({
  // Modules
  imports:
  [
    // Angular
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule, // NgModel lives here
    ReactiveFormsModule,
    HttpClientModule,

    // Material-Design
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatButtonModule,
    MatTooltipModule
  ],
  // Services
  providers:
  [
    StringsService,
    LogService,
    FileDownloaderService,
    TilesDownloaderService
  ],
  // Components
  declarations:
  [
    // Components
    AppComponent,
    MainComponent,
    HeaderComponent,
    TilesDownloaderComponent,
    MessagesBoardComponent,
    MapPreviewComponent,
    // fin
  ],
  // Dynamically loaded components
  entryComponents: [],
  // Run (Kickoff application)
  bootstrap:
  [
    AppComponent
  ]
})
export class AppModule
{ 
  public constructor()
  {
    console.log("App.module - ctor");
  }
}