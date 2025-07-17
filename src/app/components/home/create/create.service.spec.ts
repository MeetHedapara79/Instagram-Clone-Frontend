import { TestBed } from '@angular/core/testing';

import { CreateService } from './create.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('CreateService', () => {
  let service: CreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CreateService,
        provideHttpClient(),
        provideHttpClientTesting() 
      ]
    });
    service = TestBed.inject(CreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
