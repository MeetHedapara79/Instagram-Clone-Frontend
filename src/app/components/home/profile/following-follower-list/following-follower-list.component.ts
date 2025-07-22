import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProfileService } from '../profile.service';
import { DecodedToken, decodeToken } from '../../../../utils/jwtdecode';

@Component({
  selector: 'app-following-follower-list',
  imports: [CommonModule],
  templateUrl: './following-follower-list.component.html',
  styleUrl: './following-follower-list.component.css',
})
export class FollowingFollowerListComponent {
  @Input() followingFollowerId!: string | null;

  @Input() listType!: string;

  @Output() close = new EventEmitter<void>();

  following: {
    id: string;
    username: string;
    profilePic: string | null;
  }[] = [];

  follower: {
    id: string;
    username: string;
    profilePic: string | null;
  }[] = [];

  authToken: DecodedToken = { username: '', id: '', email: '' };

  defaultImage: string =
    'https://storage.googleapis.com/a1aa/image/07245c34-77f4-4942-6bcd-50f96fa1bc49.jpg';

  constructor(
    public _profileService: ProfileService,
  ) {
    const token = localStorage.getItem('authToken');
    this.authToken = decodeToken(token);
  }

  ngOnInit() {
    if (this.followingFollowerId) {
      if (this.listType == 'Following') {
        this._profileService
          .followingList(this.followingFollowerId)
          .subscribe((res) => {
            this.following = res.data;
          });
      } else {
        this._profileService
          .followerList(this.followingFollowerId)
          .subscribe((res) => {
            this.follower = res.data;
          });
      }
    }
  }

  onClose() {
    this.close.emit();
  }
}
