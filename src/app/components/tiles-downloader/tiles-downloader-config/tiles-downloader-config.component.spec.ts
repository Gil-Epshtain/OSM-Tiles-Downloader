import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TilesDownloaderConfigComponent } from './tiles-downloader-config.component';

describe('TilesDownloaderConfigComponent', () => {
  let component: TilesDownloaderConfigComponent;
  let fixture: ComponentFixture<TilesDownloaderConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TilesDownloaderConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TilesDownloaderConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
