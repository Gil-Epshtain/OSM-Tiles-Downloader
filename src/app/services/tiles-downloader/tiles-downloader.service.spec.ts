import { TestBed, inject } from '@angular/core/testing';

import { TilesDownloaderService } from './tiles-downloader.service';

describe('TilesDownloaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TilesDownloaderService]
    });
  });

  it('should be created', inject([TilesDownloaderService], (service: TilesDownloaderService) => {
    expect(service).toBeTruthy();
  }));
});
