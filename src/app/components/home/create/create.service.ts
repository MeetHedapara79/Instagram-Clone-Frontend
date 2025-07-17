import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CreatePostValidate } from './create.types';

@Injectable({
  providedIn: 'root',
})
export class CreateService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  createPost = (post: FormData) => {
    return this.http.post<{ data: CreatePostValidate; message: string }>(
      `${this.baseUrl}posts/create`,
      post,
      {
        withCredentials: true,
      }
    );
  };

  getPostsByUserId = (userId: string) => {
    return this.http.get<CreatePostValidate[]>(
      `${this.baseUrl}posts/getPosts/${userId}`,
      {
        withCredentials: true,
      }
    );
  };

  getPostByPostId = (postId: string) => {
    return this.http.get<{ data: CreatePostValidate; message: string }>(
      `${this.baseUrl}posts/getPostByPostId/${postId}`,
      { withCredentials: true }
    );
  };

  tagUsers = (data:{userIds: string[], postId: string}) => {
    return this.http.post<{ message: string }>(`${this.baseUrl}user/tagUser`, data, {
      withCredentials: true,
    });
  };
}
