import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NewMessageSchema } from '../message.types';
import { HomeService } from '../../home.service';
import { User } from '../../navbar/navbar.types';
import { DecodedToken, decodeToken } from '../../../../utils/jwtdecode';
import { CookieService } from 'ngx-cookie-service';
import { FollowingPostsSchema } from '../../home-page/home-page.types';
import { CommentComponent } from '../../home-page/comment/comment.component';
import { ShareComponent } from '../../reels/share/share.component';
import { LikesComponent } from '../../home-page/likes/likes.component';
import { HomePageService } from '../../home-page/home-page.service';
import { CommonModule } from '@angular/common';
import { CreateService } from '../../create/create.service';
import { CreatePostValidate } from '../../create/create.types';

@Component({
  selector: 'app-open-post',
  imports: [CommentComponent, ShareComponent, LikesComponent, CommonModule],
  templateUrl: './open-post.component.html',
  styleUrl: './open-post.component.css',
})
export class OpenPostComponent {
  @Input() post!: NewMessageSchema;
  @Output() close = new EventEmitter<void>();
  defaultImage: string =
    'https://storage.googleapis.com/a1aa/image/07245c34-77f4-4942-6bcd-50f96fa1bc49.jpg';
  videoExtention: string[] = [
    'mp4',
    'quicktime',
    'x-msvideo',
    'x-ms-wmv',
    'x-flv',
    'webm',
  ];
  followingPosts: FollowingPostsSchema[] = [];
  likeListData: string[] = [];
  postIdArray: string[] = [];
  selectedPostIdForLikes: string | null = null;
  selectedPostIdForComments: string | null = null;
  selectedPostIdForShare: FollowingPostsSchema | null = null;
  authToken: DecodedToken = { username: '', id: '', email: '' };
  postData:FollowingPostsSchema={
    id: '',
    content: '',
    userId: '',
    likes: 0,
    comments: null,
    user: { id: "", username: ""}
  }
  
  constructor(
    public _homePageService: HomePageService,
    public _homeService: HomeService,
    public _cookieService: CookieService,
    public _createService: CreateService
  ) {
    const myCookie = this._cookieService.get('authToken');
    this.authToken = decodeToken(myCookie);
  }
  
  ngOnInit(): void {
    if(this.post.postId){
      this._createService.getPostByPostId(this.post.postId).subscribe((res)=>{
        this.postData.caption = res.data.caption;
        this.postData.content = res.data.content;
        this.postData.createdAt = res.data.createdAt;
        this.postData.id = res.data.id;
        this.postData.likes = res.data.likes;
        this.postData.location = res.data.location;
        this.postData.updatedAt = res.data.updatedAt;
        this.postData.userId = res.data.userId;
        this._homeService.getOneUserById(res.data.userId).subscribe((user) => {
            this.postData.user.id = user.data.id;
            this.postData.user.username = user.data.username;
            this.postData.user.profilePic = user.data.profilePic;
        });
      })
    }

    this._homePageService.getPostsOfFollowing().subscribe((res) => {
      this.followingPosts = res.data;
      res.data.forEach((e) => {
        this.postIdArray.push(e.id);
      });
    });
    

    this._homePageService.likeDataList().subscribe((res) => {
      res.data.forEach((e) => {
        if (
          this.postIdArray.includes(e.postId) &&
          e.userId == this.authToken.id
        ) {
          this.likeListData.push(e.postId);
        }
      });
    });
  }

  onLike(post: FollowingPostsSchema): void {
    this._homePageService.toggleLike({ postId: post.id }).subscribe((res) => {
      if (res.data) {
        this.likeListData.push(post.id);
        post.likes++;
      } else {
        this.likeListData = this.likeListData.filter(
          (item) => item !== post.id
        );
        post.likes--;
      }
    });
  }

  showLikes(postId: string): void {
    this.selectedPostIdForLikes = postId;
  }

  onComment(postId: string): void {
    this.selectedPostIdForComments = postId;
  }

  onShare(post: FollowingPostsSchema): void {
    this.selectedPostIdForShare = post;
  }
}
