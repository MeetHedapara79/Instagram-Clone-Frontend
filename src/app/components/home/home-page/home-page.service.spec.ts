import { TestBed } from '@angular/core/testing';

import { HomePageService } from './home-page.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('HomePageService', () => {
  let service: HomePageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HomePageService,
        provideHttpClient(),
        provideHttpClientTesting() 
      ]
    });
    service = TestBed.inject(HomePageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
