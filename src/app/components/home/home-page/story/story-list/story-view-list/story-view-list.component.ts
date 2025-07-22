import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StoryService } from '../../story.service';
import { CommonModule } from '@angular/common';
import { DecodedToken, decodeToken } from '../../../../../../utils/jwtdecode';
import { HomePageService } from '../../../home-page.service';
import { ProfileService } from '../../../../profile/profile.service';
import { FollowUserSchema } from '../../../home-page.types';
import { ViewerListSchema } from '../../story.types';

@Component({
  selector: 'app-story-view-list',
  imports: [CommonModule],
  templateUrl: './story-view-list.component.html',
  styleUrl: './story-view-list.component.css',
})
export class StoryViewListComponent {
  @Input() storyId!: string;
  @Output() close = new EventEmitter<void>();
  authToken: DecodedToken = { username: '', id: '', email: '' };
  viewList: ViewerListSchema[] = [];
  followingUserList: string[] = [];
  followRequestsSent: Set<string> = new Set();
  defaultImage: string =
  'https://storage.googleapis.com/a1aa/image/07245c34-77f4-4942-6bcd-50f96fa1bc49.jpg';

  constructor(
    public _homePageService: HomePageService,
    public _storyService: StoryService,
    public _profileService: ProfileService
  ) {
    const token = localStorage.getItem('authToken');
    this.authToken = decodeToken(token);
  }

  ngOnInit() {
    this._profileService.followingList(this.authToken.id).subscribe((res)=>{
      this.followingUserList = res.data.map((id)=>id.id);
    });
    this._storyService.viewerList(this.storyId).subscribe((res) => {
      this.viewList = res.data;
    });
  }

  onClose() {
    this.close.emit();
  }

  onFollow(userId: string): void {
    this._homePageService
      .followUser({ followerId: this.authToken.id, followingId: userId })
      .subscribe((res: { data: FollowUserSchema; message: string }) => {
        this.followRequestsSent.add(userId);
      });
  }
}
