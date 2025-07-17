import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareComponent } from './share.component';
import { provideHttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

describe('ShareComponent', () => {
  let component: ShareComponent;
  let fixture: ComponentFixture<ShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareComponent],
      providers: [
        provideHttpClient(),
        {
          provide: CookieService,
          useValue: {
            get: (key: string) => {
              if (key === 'authToken') {
                return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
                       'eyJpZCI6IjEyMyIsInVzZXJuYW1lIjoiZGVtb3VzZXIiLCJlbWFpbCI6ImRlbW9AZ21haWwuY29tIn0.' +
                       'signature';
              }
              return '';
            }
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
