import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HomePageService } from './home-page.service';
import { User } from '../navbar/navbar.types';
import { DecodedToken, decodeToken } from '../../../utils/jwtdecode';
import {
  FollowingPostsSchema,
  FollowUserSchema,
  LikeDataListSchema,
} from './home-page.types';
import { ProfileService } from '../profile/profile.service';
import { LikesComponent } from './likes/likes.component';
import { CommentComponent } from './comment/comment.component';
import { ShareComponent } from '../reels/share/share.component';
import { MessageService } from '../message/message.service';
import { HomeService } from '../home.service';
import { StoryComponent } from './story/story.component';
import { StoryListComponent } from './story/story-list/story-list.component';
import { StoryService } from './story/story.service';
import { TagListComponent } from "./tag-list/tag-list.component";

@Component({
  selector: 'app-home-page',
  imports: [
    CommonModule,
    LikesComponent,
    CommentComponent,
    ShareComponent,
    StoryComponent,
    StoryListComponent,
    TagListComponent
],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  suggestedUsers: User[] = [];
  followingUserList: string[] = [];
  followRequestsSent: Set<string> = new Set();
  followingPosts: FollowingPostsSchema[] = [];
  defaultImage: string =
    'https://storage.googleapis.com/a1aa/image/07245c34-77f4-4942-6bcd-50f96fa1bc49.jpg';
  authToken: DecodedToken = { username: '', id: '', email: '' };
  likeListData: string[] = [];
  postIdArray: string[] = [];
  selectedPostIdForLikes: string | null = null;
  selectedPostIdForComments: string | null = null;
  selectedPostIdForShare: FollowingPostsSchema | null = null;
  selectedPostIdForTag:string | null = null;
  videoExtention: string[] = [
    'mp4',
    'quicktime',
    'x-msvideo',
    'x-ms-wmv',
    'x-flv',
    'webm',
  ];
  stories: {
    id: string;
    username: string;
    profilePic?: string | null | undefined;
  }[] = [];
  currentUser = {
    id: '',
    username: '',
    profilePic: '',
  };
  selectedStory: any = null;
  showCreateStoryModal: boolean = false;
  tagedPosts: string[] = [];

  constructor(
    public _homePageService: HomePageService,
    public _profileService: ProfileService,
    public _messageService: MessageService,
    public _homeService: HomeService,
    public _storyService: StoryService
  ) {
    const token = localStorage.getItem('authToken');    
    this.authToken = decodeToken(token);
    this.currentUser.id = this.authToken.id;
    this.currentUser.username = this.authToken.username;
  }

  ngOnInit(): void {
    this.loadStories();
    this._homeService.getOneUserById(this.authToken.id).subscribe((res) => {
      this.currentUser.profilePic = res.data.profilePic ?? this.defaultImage;
    });
    this._homePageService
      .getSuggestedUserlist()
      .subscribe((res: { data: User[]; message: string }) => {
        this.suggestedUsers = res.data;
      });

    this._homePageService.getPostsOfFollowing().subscribe((res) => {
      this.followingPosts = res.data;
      res.data.forEach((e) => this.postIdArray.push(e.id));
      this._homePageService.getAllTagedPosts().subscribe((res) => {
        this.followingPosts.forEach((id) => {
          if (res.data.includes(id.id)) {
            this.tagedPosts.push(id.id);
          }
        });
      });
    });
    this._profileService.followingList(this.authToken.id).subscribe((res) => {
      this.followingUserList = res.data.map((id) => id.id);
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
    this._messageService.connectSocket();
  }

  onFollow(userId: string): void {
    this._homePageService
      .followUser({ followerId: this.authToken.id, followingId: userId })
      .subscribe((res: { data: FollowUserSchema; message: string }) => {
        this.followRequestsSent.add(userId);
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

  onTag(postId:string){
    this.selectedPostIdForTag = postId;
  }

  openCreateStoryModal() {
    this.showCreateStoryModal = true;
  }

  loadStories() {
    this._storyService.getAllActiveStories().subscribe({
      next: (res) => {
        // If your response is now wrapped in `data`
        if (res && res.data && Array.isArray(res.data)) {
          res.data.forEach((id) => {
            if (!this.stories.some((user) => user.id == id.userId)) {
              this.stories.push(id.user);
            }
          });
        } else {
          this.stories = []; // Fallback in case of error or invalid data
        }
      },
      error: (err) => {
        console.error('Failed to load stories', err);
        this.stories = [];
      },
    });
  }

  // Handle story viewing
  viewStory(story: any) {
    console.log('🚀 ~ HomePageComponent ~ viewStory ~ story:', story);
    this.selectedStory = story;
  }

  closeStoryList() {
    this.selectedStory = null; // Close the story list by setting the selected story to null
  }
}
