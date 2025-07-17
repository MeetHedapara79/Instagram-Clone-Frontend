import { TestBed } from '@angular/core/testing';

import { LikesService } from './likes.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('LikesService', () => {
  let service: LikesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LikesService,
        provideHttpClient(),
        provideHttpClientTesting() 
      ]
    });
    service = TestBed.inject(LikesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
