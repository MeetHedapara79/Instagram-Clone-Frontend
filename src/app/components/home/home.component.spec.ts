import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { HttpClientModule } from '@angular/common/http'; // ✅ Required
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // ✅ Import HttpClientModule for HomeService to work
      imports: [HttpClientModule, HomeComponent],
      providers: [
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
              paramMap: { get: () => null },
            },
            params: of({}),
            queryParams: of({}),
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
