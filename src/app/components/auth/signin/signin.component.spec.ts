import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SigninComponent } from './signin.component';
import { provideHttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('SigninComponent', () => {
  let component: SigninComponent;
  let fixture: ComponentFixture<SigninComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SigninComponent],
      providers: [
        provideHttpClient(),

        // ✅ Mock CookieService
        {
          provide: CookieService,
          useValue: {
            get: (key: string) => {
              if (key === 'authToken') {
                return (
                  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
                  'eyJpZCI6IjEyMyIsInVzZXJuYW1lIjoiZGVtb3VzZXIiLCJlbWFpbCI6ImRlbW9AZ21haWwuY29tIn0.' +
                  'signature'
                );
              }
              return '';
            },
            // ✅ Add this line:
            delete: (key: string) => {}
          }
        },
        

        // ✅ Mock ActivatedRoute
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => null, // or return something like 'mock-value' if used
              }
            },
            params: of({}),
            queryParams: of({})
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
