import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LikesService {
baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  likedPostByUser = (postId:{postId:string}) => {
    return this.http.post<{data:{id:string, username:string, profilePic:string}[], message:string}>(`${this.baseUrl}posts/likedPostByUser`, postId, {withCredentials:true})
  }

}
