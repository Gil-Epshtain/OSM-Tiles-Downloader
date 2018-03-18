import { TestBed, inject } from '@angular/core/testing';

import { FileDownloaderService } from './file-downloader.service';

describe('FileDownloaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FileDownloaderService]
    });
  });

  it('should be created', inject([FileDownloaderService], (service: FileDownloaderService) => {
    expect(service).toBeTruthy();
  }));
});
