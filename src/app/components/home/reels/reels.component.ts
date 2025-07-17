import { Component } from '@angular/core';
import { HomePageService } from '../home-page/home-page.service';
import { CookieService } from 'ngx-cookie-service';
import { DecodedToken, decodeToken } from '../../../utils/jwtdecode';
import { FollowingPostsSchema, FollowUserSchema } from '../home-page/home-page.types';
import { CommonModule } from '@angular/common';
import { LikesComponent } from "../home-page/likes/likes.component";
import { CommentComponent } from "../home-page/comment/comment.component";
import { CommentService } from '../home-page/comment/comment.service';
import { ShareComponent } from "./share/share.component";

@Component({
  selector: 'app-reels',
  imports: [CommonModule, LikesComponent, CommentComponent, ShareComponent],
  templateUrl: './reels.component.html',
  styleUrl: './reels.component.css'
})
export class ReelsComponent {
  authToken: DecodedToken = { username: '', id: '', email: '' };
  videoExtention:string[] = ["mp4", "quicktime", "x-msvideo", "x-ms-wmv", "x-flv", "webm"];
  defaultImage =
    'https://storage.googleapis.com/a1aa/image/07245c34-77f4-4942-6bcd-50f96fa1bc49.jpg';
  reels:FollowingPostsSchema[] = []
  selectedPostIdForLikes: string | null = null;
  selectedPostIdForComments: string | null = null;
  selectedPostIdForShare:FollowingPostsSchema | null = null;
  likeListData:string[] = [];
  followingPosts: FollowingPostsSchema[] = [];
  postIdArray:string[] = [];

  constructor(public _homePageService:HomePageService, public _cookieService: CookieService, public _commentService:CommentService){
    const myCookie = this._cookieService.get('authToken');
    this.authToken = decodeToken(myCookie);
  }

  ngOnInit(){
    this._homePageService.getPostsOfFollowing().subscribe((res)=>{
      res.data = res.data.filter((post)=>this.checkReel(post))
      this.reels = res.data;
    })
    this._homePageService.getPostsOfFollowing().subscribe((res) => {
      this.followingPosts = res.data;
      res.data.forEach((e)=>this.postIdArray.push(e.id));
    });
    this._homePageService.likeDataList().subscribe((res) => {
      res.data.forEach((e)=>{
        if(this.postIdArray.includes(e.postId) && e.userId == this.authToken.id){
          this.likeListData.push(e.postId);
        }
      })
    });
  }

  checkReel(post: FollowingPostsSchema): boolean {
    const extension = post.content?.split("/").pop()?.split(".").pop();
    return extension !== undefined && this.videoExtention.includes(extension);
  }

  onLike(post: FollowingPostsSchema): void {
    this._homePageService.toggleLike({postId:post.id}).subscribe((res) => {
      if (res.data) {
        this.likeListData.push(post.id)
        post.likes++;
        
      } else {
        this.likeListData = this.likeListData.filter(item => item !== post.id);
        post.likes--;
      }
    });
  }

  showLikes(postId: string): void {
    this.selectedPostIdForLikes = postId;
  }
  
  onComment(postId: string): void {
    this.selectedPostIdForComments = postId
  }

  onShare(reel:FollowingPostsSchema):void {
    this.selectedPostIdForShare = reel;
  }
}
