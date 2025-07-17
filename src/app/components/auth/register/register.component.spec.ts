import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { provideHttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideHttpClient(),
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
            }
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => null // mock any route params if needed
              }
            },
            params: of({}),
            queryParams: of({})
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
