import { TestBed, inject } from '@angular/core/testing';

import { StringsService } from './strings.service';

describe('StringsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StringsService]
    });
  });

  it('should be created', inject([StringsService], (service: StringsService) => {
    expect(service).toBeTruthy();
  }));
});
