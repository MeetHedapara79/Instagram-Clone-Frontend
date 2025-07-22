import { Component, ElementRef, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { DecodedToken, decodeToken } from '../../../utils/jwtdecode';
import { CreateService } from '../create/create.service';
import { CreatePostValidate } from '../create/create.types';
import { CommonModule } from '@angular/common';
import { ProfileService } from './profile.service';
import { HomeService } from '../home.service';
import { User } from '../navbar/navbar.types';
import { ChangeDetectorRef } from '@angular/core';
import { FollowingFollowerListComponent } from './following-follower-list/following-follower-list.component';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FollowingFollowerListComponent, RouterOutlet, RouterLink],
  providers: [CookieService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  profileImage: string = '';
  defaultImage =
    'https://storage.googleapis.com/a1aa/image/07245c34-77f4-4942-6bcd-50f96fa1bc49.jpg';
  authToken: DecodedToken = { username: '', id: '', email: '' };
  posts: CreatePostValidate[] = [];
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
  timestamp: number = Date.now();
  videoExtention: string[] = [
    'mp4',
    'quicktime',
    'x-msvideo',
    'x-ms-wmv',
    'x-flv',
    'webm',
  ];
  userData: User = {
    password: '',
    username: '',
    id: '',
    email_phone: '',
    recoveryCode: null,
    profilePic: null,
    followers: null,
    following: null,
    bio: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  listType: string = '';

  followingFollowerId: string | null = null;

  isOwnProfile: boolean = true;

  isTagRoute = false;

  @ViewChild('fileInput') fileInput: ElementRef | undefined;

  constructor(
    public _createService: CreateService,
    public _profileService: ProfileService,
    public _homeService: HomeService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {
    
    this.router.events.subscribe(() => {
      this.isTagRoute = this.router.url.includes('/tag');
    });
  }

  ngOnInit() {
    const token = localStorage.getItem('authToken');
    this.authToken = decodeToken(token);
    this.route.paramMap.subscribe(params => {
      const profileId = params.get('id') ?? this.authToken.id;
      this.isOwnProfile = profileId === this.authToken.id;
  
      this._homeService.getOneUserById(profileId).subscribe((res) => {
        this.userData = res.data;
      });
  
      this._createService.getPostsByUserId(profileId).subscribe((res) => {
        this.posts = res;
      });
  
      this._profileService.followingList(profileId).subscribe((res) => {
        this.following = res.data;
      });
  
      this._profileService.followerList(profileId).subscribe((res) => {
        this.follower = res.data;
      });
    });
  }

  onProfileImageClick() {
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const formData = new FormData();
    formData.append('profilePic', file);
    formData.append('userId', this.authToken.id);
    const reader = new FileReader();
    reader.onload = () => {
      this.profileImage = reader.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);

    this._profileService.uploadProfilePic(formData).subscribe((res) => {
      this.userData.profilePic = res.data;
      this.timestamp = Date.now();
      this.cdr.detectChanges();
    });
  }

  onFollowers(id: string, type: number) {
    this.followingFollowerId = id;
    if (type == 1) {
      this.listType = 'Follower';
    } else{
      this.listType = 'Following';
    }
  }

  onFollowing(id: string, type: number) {
    this.followingFollowerId = id;
    if (type == 0) {
      this.listType = 'Following';
    } else{
      this.listType = 'Follower';
    }
  }
}
