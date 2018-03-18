import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TilesDownloaderComponent } from './tiles-downloader.component';

describe('TilesDownloaderComponent', () => {
  let component: TilesDownloaderComponent;
  let fixture: ComponentFixture<TilesDownloaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TilesDownloaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TilesDownloaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
