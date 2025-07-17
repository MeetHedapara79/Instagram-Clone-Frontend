import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SearchService } from './search.service';
import { provideHttpClient } from '@angular/common/http';

describe('SearchService', () => {
  let service: SearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SearchService,
        provideHttpClient(),
        provideHttpClientTesting() 
      ]
    });
    service = TestBed.inject(SearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
