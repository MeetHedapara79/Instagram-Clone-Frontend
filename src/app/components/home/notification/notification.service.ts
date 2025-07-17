import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FollowUserSchema } from '../home-page/home-page.types';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  notificationList = () => {
    return this.http.get<{ data: {id:string, username:string, profilePic:string}[], message: string }>(`${this.baseUrl}user/notificationList`, {withCredentials:true})
  }

  confirmFollow = (userData: FollowUserSchema) => {
    return this.http.post<{data:FollowUserSchema, message: string}>(`${this.baseUrl}user/confirmFollow`, userData, {
      withCredentials: true,
    });
  }
}
