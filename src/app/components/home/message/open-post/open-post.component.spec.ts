import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OpenPostComponent } from './open-post.component';
import { provideHttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('OpenPostComponent', () => {
  let component: OpenPostComponent;
  let fixture: ComponentFixture<OpenPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenPostComponent],
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
                  'dummySignature'
                );
              }
              return '';
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OpenPostComponent);
    component = fixture.componentInstance;

    // ✅ Set the @Input() before detectChanges
    component.post = {
      postId: 'mock-post-id',
      // set other fields if necessary
    } as any; // use `as any` if partial

    fixture.detectChanges(); // now safe to call
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
