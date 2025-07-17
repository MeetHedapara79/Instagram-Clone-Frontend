import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HomePageService } from '../home-page.service';
import { CookieService } from 'ngx-cookie-service';
import { ProfileService } from '../../profile/profile.service';
import { DecodedToken, decodeToken } from '../../../../utils/jwtdecode';
import { FollowUserSchema } from '../home-page.types';
import { LikesService } from './likes.service';

@Component({
  selector: 'app-likes',
  imports: [CommonModule],
  templateUrl: './likes.component.html',
  styleUrl: './likes.component.css',
})
export class LikesComponent {
  @Input() postId!: string;
  @Output() close = new EventEmitter<void>();
  suggestedUsers: {id:string, username:string, profilePic:string}[] = [];
  followingUserList: string[] = [];
  followRequestsSent: Set<string> = new Set();
  authToken: DecodedToken = { username: '', id: '', email: '' };
  defaultImage: string =
    'https://storage.googleapis.com/a1aa/image/07245c34-77f4-4942-6bcd-50f96fa1bc49.jpg';

  constructor(
    public _homePageService: HomePageService,
    public _cookieService: CookieService,
    public _profileService: ProfileService,
    public _likesService: LikesService
  ) {
    const myCookie = this._cookieService.get('authToken');
    this.authToken = decodeToken(myCookie);


  }

  ngOnInit() {
    this._profileService.followingList(this.authToken.id).subscribe((res)=>{
      this.followingUserList = res.data.map((id)=>id.id);
    });
    this._likesService.likedPostByUser({postId:this.postId}).subscribe((res) => {
      this.suggestedUsers = res.data;
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
