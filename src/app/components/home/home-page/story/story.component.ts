import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { StoryService } from './story.service';
import { DecodedToken, decodeToken } from '../../../../utils/jwtdecode';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-story',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './story.component.html',
  styleUrl: './story.component.css',
})
export class StoryComponent {
  postForm: FormGroup;
  fileData:object | undefined;
  dragging = false;
  previewUrl: string | null = null;
  isImage: boolean = false;
  isVideo: boolean = false;
  showSidePanel: boolean = false;
  authToken:DecodedToken = {username:"", id:"", email:""};
  errorMessage:string = "";
  @Output() close = new EventEmitter<void>();
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(private _storyService: StoryService) {
      this.postForm = new FormGroup({
        caption: new FormControl(''),
        type: new FormControl(''),
      })
  }

  ngOnInit(){
    const token = localStorage.getItem('authToken');
    this.authToken = decodeToken(token);
  }

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
      if(files[0].size > 1073741824){
        this.errorMessage = "File size exceeds the allowed limit";
      }
      else{
        this.errorMessage = "";
        this.handleFile(files[0]);
      }
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length > 0) {
      if(input.files[0].size > 1073741824){
        this.errorMessage = "File size exceeds the allowed limit";
      }
      else{
        this.errorMessage = "";
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

  onSubmit(){
    console.log("In submit");
    // Handle form submission logic here
    if (this.postForm.invalid) {
      console.log('Form is invalid');
      return;
    }

    const formData = new FormData();

    formData.append('caption', this.postForm.value.caption);
    formData.append('type', this.postForm.value.type);
  
    if (this.fileData) {
      formData.append('mediaUrl', this.fileData as Blob);
    }
  
    formData.append('userId', this.authToken.id);

    this._storyService.createStory(formData).subscribe(
      (response) => {
        console.log('Post created successfully', response);
       
      },
      (error) => {
        console.error('Error creating post', error);
        // Handle error response
      }
    );
    this.close.emit();
  }
}
