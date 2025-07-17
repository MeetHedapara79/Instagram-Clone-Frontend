import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { CommentSchema } from './comment.types';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getAllComments = (post: { postId: string }) => {
    return this.http.post<{ data: CommentSchema[]; message: string }>(
      `${this.baseUrl}posts/getAllComments`,
      post,
      { withCredentials: true }
    );
  };

  createComment = (comment: { postId: string; content: string; parentId?: string | null }) => {
    return this.http.post(`${this.baseUrl}posts/createComment`, comment, { withCredentials: true });
  };
  
}
