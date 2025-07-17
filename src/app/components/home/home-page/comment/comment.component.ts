import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommentService } from './comment.service';
import { DecodedToken, decodeToken } from '../../../../utils/jwtdecode';
import { CookieService } from 'ngx-cookie-service';
import { CommentSchema } from './comment.types';
import { HomeService } from '../../home.service';
import { User } from '../../navbar/navbar.types';
import { CommonModule } from '@angular/common';
import { CreateService } from '../../create/create.service';
import { CreatePostValidate } from '../../create/create.types';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LikesComponent } from '../likes/likes.component';
import { FollowingPostsSchema } from '../home-page.types';
import { HomePageService } from '../home-page.service';
import { NestedCommentComponent } from './nested-comment/nested-comment.component';

@Component({
  selector: 'app-comment',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LikesComponent,
    NestedCommentComponent,
  ],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css',
})
export class CommentComponent {
  @Input() postId!: string;
  @Output() close = new EventEmitter<void>();
  @ViewChild('commentInput') commentInput!: ElementRef<HTMLInputElement>;
  authToken: DecodedToken = { username: '', id: '', email: '' };
  commentForm: FormGroup;
  followingPosts: FollowingPostsSchema[] = [];
  postIdArray: string[] = [];
  likeListData: string[] = [];
  selectedPostIdForLikes: string | null = null;
  postData: CreatePostValidate = {
    userId: '',
    content: '',
    id: '',
    likes: 0,
    comments: null,
  };
  commentList: CommentSchema[] = [];
  userData: User = {
    id: '',
    createdAt: undefined,
    username: '',
    password: '',
    email_phone: '',
    updatedAt: undefined,
  };
  videoExtention: string[] = [
    'mp4',
    'quicktime',
    'x-msvideo',
    'x-ms-wmv',
    'x-flv',
    'webm',
  ];
  defaultImage: string =
    'https://storage.googleapis.com/a1aa/image/07245c34-77f4-4942-6bcd-50f96fa1bc49.jpg';
  replyToComment: CommentSchema | null = null;

  constructor(
    public _commentService: CommentService,
    public _cookieService: CookieService,
    public _homeService: HomeService,
    public _createService: CreateService,
    public _homePageService: HomePageService
  ) {
    const myCookie = this._cookieService.get('authToken');
    this.authToken = decodeToken(myCookie);

    this.commentForm = new FormGroup({
      content: new FormControl('', [
        Validators.required,
        this.commentValidator,
      ]),
    });
  }

  ngOnInit() {
    this._homeService.getOneUser().subscribe((res) => {
      this.userData = res.data;
    });
    this._createService.getPostByPostId(this.postId).subscribe((res) => {
      this.postData = res.data;
    });
    this._commentService
      .getAllComments({ postId: this.postId })
      .subscribe((res) => {
        this.commentList = res.data;
      });
    this._homePageService.getPostsOfFollowing().subscribe((res) => {
      this.followingPosts = res.data;
      res.data.forEach((e) => this.postIdArray.push(e.id));
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

  commentValidator(control: FormControl): { [key: string]: boolean } | null {
    if (control.value.trim().length > 0) {
      return null;
    }
    return { invalidComment: true };
  }

  onClose() {
    this.close.emit();
  }

  showLikes(postId: string): void {
    this.selectedPostIdForLikes = postId;
  }

  onLike(post: { postId: string; likes: number }): void {
    this._homePageService
      .toggleLike({ postId: post.postId })
      .subscribe((res) => {
        if (res.data) {
          this.likeListData.push(post.postId);
          post.likes++;
        } else {
          this.likeListData = this.likeListData.filter(
            (item) => item !== post.postId
          );
          post.likes--;
        }
      });
  }

  onSubmit() {
    if (this.commentForm.invalid) {
      console.log('Comment is Invalid');
      return;
    }
  
    const payload = {
      ...this.commentForm.value,
      postId: this.postId,
      parentId: this.replyToComment?.id ?? null,
    };
  
    this._commentService.createComment(payload).subscribe((res) => {
      this._commentService
        .getAllComments({ postId: this.postId })
        .subscribe((res) => {
          this.commentList = res.data;
          this.commentForm.reset();
          this.replyToComment = null;
        });
    });
  }
  

  focusCommentInput(): void {
    setTimeout(() => {
      this.commentInput?.nativeElement.focus();
    }, 0);
  }

  setReplyToComment(comment: CommentSchema) {
    this.replyToComment = comment;
    this.focusCommentInput();
  }
}