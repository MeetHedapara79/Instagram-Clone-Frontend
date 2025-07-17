import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ActiveStoriesSchema, CreateStoryRequestSchema, StorySchema, ViewerListSchema } from './story.types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoryService {

  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}


  createStory(data: FormData): Observable<StorySchema> {
    return this.http.post<StorySchema>(`${this.baseUrl}story/stories`, data, {withCredentials:true});
  }

  getUserStories(userId: string): Observable<StorySchema[]> {
    return this.http.get<StorySchema[]>(`${this.baseUrl}story/stories/${userId}`, {withCredentials:true});
  }

  viewStory(storyId: string, viewerId: string): Observable<{message:string}> {
    return this.http.post<{message:string}>(`${this.baseUrl}story/stories/${storyId}/views`, { viewerId }, {withCredentials:true});
  }

  getAllActiveStories(): Observable<{data:ActiveStoriesSchema[], message:string}> {
    return this.http.get<{data:ActiveStoriesSchema[], message:string}>(`${this.baseUrl}story/stories/getAllActiveStories`, {withCredentials:true});
  }

  viewerList(storyId:string){
    return this.http.get<{data:ViewerListSchema[], message:string}>(`${this.baseUrl}story/stories/viewerList/${storyId}`, {withCredentials:true});
  }
}
