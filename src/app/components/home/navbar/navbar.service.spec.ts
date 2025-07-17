import { TestBed } from '@angular/core/testing';

import { NavbarService } from './navbar.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('NavbarService', () => {
  let service: NavbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NavbarService,
        provideHttpClient(),
        provideHttpClientTesting() 
      ]
    });
    service = TestBed.inject(NavbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
