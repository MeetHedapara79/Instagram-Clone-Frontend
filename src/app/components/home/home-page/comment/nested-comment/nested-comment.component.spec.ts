import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NestedCommentComponent } from './nested-comment.component';
import { provideHttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

describe('NestedCommentComponent', () => {
  let component: NestedCommentComponent;
  let fixture: ComponentFixture<NestedCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NestedCommentComponent],
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
    }).compileComponents();
  
    fixture = TestBed.createComponent(NestedCommentComponent);
    component = fixture.componentInstance;
  
    // ✅ Provide mock input if required
    component.comment = {
      user: {
        name: 'Demo User'
      },
      text: 'Sample comment'
    } as any;
  
    fixture.detectChanges();
  });
  

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
