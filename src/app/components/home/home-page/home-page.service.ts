import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { User } from '../navbar/navbar.types';
import {
  FollowingPostsSchema,
  FollowUserSchema,
  GetTagedPostsByPostIdSchema,
  LikeDataListSchema,
} from './home-page.types';

@Injectable({
  providedIn: 'root',
})
export class HomePageService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getSuggestedUserlist = () => {
    return this.http.get<{ data: User[]; message: string }>(
      `${this.baseUrl}user/suggestionUsers`,
      {
        withCredentials: true,
      }
    );
  };

  followUser = (userData: FollowUserSchema) => {
    return this.http.post<{ data: FollowUserSchema; message: string }>(
      `${this.baseUrl}user/followUser`,
      userData,
      {
        withCredentials: true,
      }
    );
  };

  getPostsOfFollowing = () => {
    return this.http.get<{ data: FollowingPostsSchema[]; message: string }>(
      `${this.baseUrl}posts/getPostsOfFollowing`,
      { withCredentials: true }
    );
  };

  toggleLike = (post: { postId: string }) => {
    return this.http.post<{ data: boolean; message: string }>(
      `${this.baseUrl}posts/toggleLike`,
      post,
      { withCredentials: true }
    );
  };

  likeDataList = () => {
    return this.http.get<{ data: LikeDataListSchema[]; message: string }>(
      `${this.baseUrl}posts/likeDataList`,
      { withCredentials: true }
    );
  };

  getTagedPostsByPostId = (postId: string) => {
    return this.http.get<{
      data: GetTagedPostsByPostIdSchema[];
      message: string;
    }>(`${this.baseUrl}posts/getTagedPostsByPostId/${postId}`, {
      withCredentials: true,
    });
  };

  getAllTagedPosts = () => {
    return this.http.get<{
      data: string[];
      message: string;
    }>(`${this.baseUrl}posts/getAllTagedPosts`, {
      withCredentials: true,
    });
  };
}
