import { TestBed } from '@angular/core/testing';

import { MessageService } from './message.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MessageService,
        provideHttpClient(),
        provideHttpClientTesting() 
      ]
    });
    service = TestBed.inject(MessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
