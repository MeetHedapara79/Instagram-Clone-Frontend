import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TagComponent } from './tag.component';
import { provideHttpClient } from '@angular/common/http'; // ✅ Needed for HttpClient
import { ProfileService } from '../profile.service';
import { CookieService } from 'ngx-cookie-service';

describe('TagComponent', () => {
  let component: TagComponent;
  let fixture: ComponentFixture<TagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagComponent],
      providers: [
        provideHttpClient(),
        ProfileService,
        {
          provide: CookieService,
          useValue: {
            get: (key: string) => {
              if (key === 'authToken') {
                return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
                       'eyJpZCI6InRlc3RJZCIsInVzZXJuYW1lIjoiam9obmRvZSIsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSJ9.' +
                       'signature';
              }
              return '';
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
