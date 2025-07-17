import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { DecodedToken, decodeToken } from '../../../utils/jwtdecode';
import { CreateService } from './create.service';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { SearchedUserSchema } from '../search/search.types';
import { SearchService } from '../search/search.service';

@Component({
  selector: 'app-create',
  imports: [CommonModule, ReactiveFormsModule],
  providers: [CookieService],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css',
})
export class CreateComponent {
  postForm: FormGroup;
  fileData: object | undefined;
  dragging = false;
  previewUrl: string | null = null;
  isImage: boolean = false;
  isVideo: boolean = false;
  showSidePanel: boolean = false;
  authToken: DecodedToken = { username: '', id: '', email: '' };
  errorMessage: string = '';
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  // @ViewChild('mediaWrapper') mediaWrapper!: ElementRef<HTMLDivElement>;
  @ViewChild('mediaElement') mediaElement!: ElementRef<HTMLElement>;
  tagResults:SearchedUserSchema[] = []; 
  postId:string = "";
  tagedUsers:string[] = [];

  textboxPosition: { x: number; y: number } | null = null;
  tagForm: FormGroup;
  private destroy$ = new Subject<void>();
  constructor(
    private _cookieService: CookieService,
    public _createService: CreateService,
    private router: Router,
    private zone: NgZone,
    private fb: FormBuilder,
    private _searchService: SearchService
  ) {
    this.postForm = new FormGroup({
      caption: new FormControl(''),
      location: new FormControl(''),
    });

    const myCookie = this._cookieService.get('authToken');

    this.authToken = decodeToken(myCookie);

    this.tagForm = this.fb.group({
      clickText: ['']
    });
  }

  ngOnInit() {
    document.addEventListener('click', this.handleGlobalClick);
    this.tagForm.get('clickText')?.valueChanges.pipe(debounceTime(500), takeUntil(this.destroy$)).subscribe((clickText:string)=>{
      this.tagUser(clickText);
    })
    
  }
  
  ngOnDestroy() {
    document.removeEventListener('click', this.handleGlobalClick);
  }
  
  handleGlobalClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
  
    // Ensure the click doesn't hide the textbox if it's inside the image/video area
    if (!target.closest('input') && !target.closest('img') && !target.closest('video')) {
      this.zone.run(() => {
        this.textboxPosition = null;
        this.tagForm.reset();
        this.tagResults = [];
      });
    }
  };
  

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragging = true;
  }

  onDragLeave(): void {
    this.dragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      if (files[0].size > 1073741824) {
        this.errorMessage = 'File size exceeds the allowed limit';
      } else {
        this.errorMessage = '';
        this.handleFile(files[0]);
      }
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      if (input.files[0].size > 1073741824) {
        this.errorMessage = 'File size exceeds the allowed limit';
      } else {
        this.errorMessage = '';
        this.handleFile(input.files[0]);
      }
    }
  }

  private handleFile(file: File): void {
    const fileType = file.type;
    if (fileType.startsWith('image/')) {
      this.fileData = file;
      this.isImage = true;
      this.isVideo = false;
    } else if (fileType.startsWith('video/')) {
      this.fileData = file;
      this.isImage = false;
      this.isVideo = true;
    } else {
      alert('Unsupported file type. Please select an image or video.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  cancel(): void {
    this.previewUrl = null;
    this.isImage = false;
    this.isVideo = false;
    this.showSidePanel = false;
  }

  next(): void {
    this.showSidePanel = true;
  }

  onMediaClick(event: MouseEvent): void {
    if (!this.mediaElement?.nativeElement) return;
  
    // Get the bounding rectangle of the image or video element
    const rect = this.mediaElement.nativeElement.getBoundingClientRect();
  
    // Calculate the click position relative to the media element
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
  
    // Update the textbox position within the Angular zone to trigger change detection
    this.zone.run(() => {
      this.textboxPosition = { x, y };
    });
  }

  tagUser(clickText:string): void {
    if(!clickText.trim()){
      this.tagResults = [];
      return;
    }

    this._searchService.searchUser(clickText).subscribe({
      next: (res) =>{
        this.tagResults = res.data || [];
        console.log("🚀 ~ CreateComponent ~ this._searchService.searchUser ~ this.tagResults:", this.tagResults)
      },
      error:(err) => {
        console.error('tag error:', err);
        this.tagResults = [];
      }
    });
  }

  onSubmit() {
    console.log('In submit');
    // Handle form submission logic here
    if (this.postForm.invalid) {
      console.log('Form is invalid');
      return;
    }

    const userPayload = {
      ...this.postForm.value,
      content: this.fileData,
      userId: this.authToken.id,
    };

    const formData = new FormData();

    formData.append('caption', this.postForm.value.caption);
    formData.append('location', this.postForm.value.location);

    if (this.fileData) {
      formData.append('content', this.fileData as Blob);
    }

    formData.append('userId', this.authToken.id);

    this._createService.createPost(formData).subscribe(
      (response) => {
        this._createService.tagUsers({userIds:this.tagedUsers, postId:response.data.id}).subscribe();
        this.router.navigate(['/home/profile']);
      },
      (error) => {
        console.error('Error creating post', error);
        // Handle error response
      }
    );
  }

  addTag(userId:string){
    this.tagedUsers.push(userId);
  }
}
