import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { SearchedUserSchema } from './search.types';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  baseUrl = environment.apiUrl;
  constructor(private http:HttpClient) { }

  searchUser(query:string){
    return this.http.get<{data:SearchedUserSchema[], message:string}>(`${this.baseUrl}user/search?query=${query}`, {withCredentials:true})
  }
}
