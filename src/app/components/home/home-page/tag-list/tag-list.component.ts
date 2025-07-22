import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HomePageService } from '../home-page.service';
import {
  FollowUserSchema,
  GetTagedPostsByPostIdSchema,
} from '../home-page.types';
import { CommonModule } from '@angular/common';
import { DecodedToken, decodeToken } from '../../../../utils/jwtdecode';
import { ProfileService } from '../../profile/profile.service';

@Component({
  selector: 'app-tag-list',
  imports: [CommonModule],
  templateUrl: './tag-list.component.html',
  styleUrl: './tag-list.component.css',
})
export class TagListComponent {
  @Input() postId!: string;
  @Output() close = new EventEmitter<void>();
  tagList: GetTagedPostsByPostIdSchema[] = [];
  authToken: DecodedToken = { username: '', id: '', email: '' };
  followingUserList: string[] = [];
  followRequestsSent: Set<string> = new Set();
  defaultImage: string =
    'https://storage.googleapis.com/a1aa/image/07245c34-77f4-4942-6bcd-50f96fa1bc49.jpg';

  constructor(
    public _profileService: ProfileService,
    public _homePageService: HomePageService
  ) {
    const token = localStorage.getItem('authToken');
    this.authToken = decodeToken(token);
  }

  ngOnInit() {
    this._profileService.followingList(this.authToken.id).subscribe((res) => {
      this.followingUserList = res.data.map((id) => id.id);
    });
    this._homePageService
      .getTagedPostsByPostId(this.postId)
      .subscribe((res) => {
        this.tagList = res.data;
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
