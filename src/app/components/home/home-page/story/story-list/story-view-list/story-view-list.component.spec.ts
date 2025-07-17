import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryViewListComponent } from './story-view-list.component';
import { provideHttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

describe('StoryViewListComponent', () => {
  let component: StoryViewListComponent;
  let fixture: ComponentFixture<StoryViewListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoryViewListComponent],
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

    fixture = TestBed.createComponent(StoryViewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
