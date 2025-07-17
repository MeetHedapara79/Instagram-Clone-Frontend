import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { TagedPostList } from './profile.types';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  uploadProfilePic(img:FormData) {
    return this.http.post<{ data: string  }>(`${this.baseUrl}user/uploadProfilePic`, img, {withCredentials: true});
  }

  followingList = (userId:string) => {
    return this.http.get<{data:{
      id: string;
      username: string;
      profilePic: string | null;
  }[],message:string}>(`${this.baseUrl}user/followingList/${userId}`, {withCredentials:true})
  }

  followerList = (userId:string) => {
    return this.http.get<{data:{
      id: string;
      username: string;
      profilePic: string | null;
  }[],message:string}>(`${this.baseUrl}user/followerList/${userId}`, {withCredentials:true})
  }

  getTagedPosts = (userId:string) => {
    return this.http.get<{data:TagedPostList[], message:string}>(`${this.baseUrl}posts/getTagedPosts/${userId}`, {withCredentials:true})
  }
}
