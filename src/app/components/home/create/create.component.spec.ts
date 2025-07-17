import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateComponent } from './create.component';
import { provideHttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

describe('CreateComponent', () => {
  let component: CreateComponent;
  let fixture: ComponentFixture<CreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateComponent],
      providers: [
        provideHttpClient(),
        {
          provide: CookieService,
          useValue: {
            get: (key: string) => {
              if (key === 'authToken') {
                return (
                  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
                  'eyJpZCI6IjEyMyIsInVzZXJuYW1lIjoiZGVtb1VzZXIiLCJlbWFpbCI6ImRlbW9AZ21haWwuY29tIn0.' +
                  'signature'
                );
              }
              return '';
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
