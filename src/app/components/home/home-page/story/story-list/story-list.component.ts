import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StoryService } from '../story.service';
import { DecodedToken, decodeToken } from '../../../../../utils/jwtdecode';
import { CommonModule } from '@angular/common';
import { StoryViewListComponent } from './story-view-list/story-view-list.component';

@Component({
  selector: 'app-story-list',
  imports: [CommonModule, StoryViewListComponent],
  templateUrl: './story-list.component.html',
  styleUrl: './story-list.component.css',
})
export class StoryListComponent {
  @Input() stories: any;
  @Output() close = new EventEmitter<void>();
  currentIndex = 0;
  intervalId: any;
  isSliderVisible = true;
  selectedPostIdForViews: string | null = null;
  viewedStoryIds: Set<string> = new Set();
  defaultImage =
    'https://storage.googleapis.com/a1aa/image/07245c34-77f4-4942-6bcd-50f96fa1bc49.jpg';

  authToken: DecodedToken = { username: '', id: '', email: '' };
  userId: string = '';
  isPausedByModal = false;
  startIndex: number = 0;
  videoExtention: string[] = [
    'mp4',
    'quicktime',
    'x-msvideo',
    'x-ms-wmv',
    'x-flv',
    'webm',
  ];

  progressBar = 0;
  progressTimer: any;
  progressInterval = 100; // in ms
  storyDuration = 7000; // matches auto-slide interval (7 seconds)

  constructor(
    private _storyService: StoryService,
  ) {
    const token = localStorage.getItem('authToken');
    this.authToken = decodeToken(token);
    this.userId = this.authToken.id;
  }

  ngOnInit() {
    this.loadStories();
  }

  ngOnDestroy() {
    this.clearTimers();
  }
  

  loadStories() {
    this._storyService.getAllActiveStories().subscribe((res) => {
      res.data.forEach((data) => {
        if (data.user.id == this.stories.id) {
          this.startIndex = res.data.indexOf(data);
          this.stories = res.data.slice(this.startIndex);
          this.currentIndex = 0;
          this.isSliderVisible = true;
          this.startAutoSlide();
        }
      });
    });
  }

  viewStory(storyId: string) {
    this.selectedPostIdForViews = storyId;
    this.pauseAutoSlide();
    this.isPausedByModal = true;
  }

  nextSlide() {
    if (this.currentIndex < this.stories.length - 1) {
      this.currentIndex++;
      this.markStoryAsViewed(this.stories[this.currentIndex]);
      this.startAutoSlide(); // restart progress
    } else {
      this.closeSlider();
    }
  }
  

  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.markStoryAsViewed(this.stories[this.currentIndex]);
      this.startAutoSlide(); // restart progress
    }
  }
  

  startAutoSlide() {
    this.clearTimers();
    this.markStoryAsViewed(this.stories[this.currentIndex]);
    this.progressBar = 0;
  
    this.progressTimer = setInterval(() => {
      this.progressBar += (this.progressInterval / this.storyDuration) * 100;
  
      if (this.progressBar >= 100) {
        this.nextSlide();
      }
    }, this.progressInterval);
  }
  

  markStoryAsViewed(story: any) {
    if (!this.viewedStoryIds.has(story.id)) {
      this.viewedStoryIds.add(story.id);
      this._storyService.viewStory(story.id, this.userId).subscribe(() => {
        console.log('Story viewed:', story.id);
      });
    }
  }

  closeSlider() {
    this.close.emit();
  }

  clearTimers() {
    if (this.progressTimer) clearInterval(this.progressTimer);
  }

  pauseAutoSlide() {
    this.clearTimers();
  }
  
  resumeAutoSlide() {
    this.startAutoSlide();
  }

  handleViewModalClose() {
    this.selectedPostIdForViews = null;
    if (this.isPausedByModal) {
      this.resumeAutoSlide();
      this.isPausedByModal = false;
    }
  }
  
}
