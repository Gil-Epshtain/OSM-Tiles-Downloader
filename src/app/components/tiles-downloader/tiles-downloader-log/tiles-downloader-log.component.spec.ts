import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TilesDownloaderLogComponent } from './tiles-downloader-log.component';

describe('TilesDownloaderLogComponent', () => {
  let component: TilesDownloaderLogComponent;
  let fixture: ComponentFixture<TilesDownloaderLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TilesDownloaderLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TilesDownloaderLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
