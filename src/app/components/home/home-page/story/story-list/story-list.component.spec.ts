import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryListComponent } from './story-list.component';
import { provideHttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

describe('StoryListComponent', () => {
  let component: StoryListComponent;
  let fixture: ComponentFixture<StoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoryListComponent],
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

    fixture = TestBed.createComponent(StoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
