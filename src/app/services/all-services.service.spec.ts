import { TestBed, inject } from '@angular/core/testing';

import { AllServicesService } from './all-services.service';

describe('AllServicesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AllServicesService]
    });
  });

  it('should be created', inject([AllServicesService], (service: AllServicesService) => {
    expect(service).toBeTruthy();
  }));
});
