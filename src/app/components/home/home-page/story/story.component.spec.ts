import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoryComponent } from './story.component';
import { provideHttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { StoryService } from './story.service';

describe('StoryComponent', () => {
  let component: StoryComponent;
  let fixture: ComponentFixture<StoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoryComponent],
      providers: [
        provideHttpClient(),
        StoryService,
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
    }).compileComponents();

    fixture = TestBed.createComponent(StoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
