import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './navbar/navbar.types';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

    getOneUser = () => {
        return this.http.get<{data:User, message:string}>(`${this.baseUrl}user/getOneUser`, {
            withCredentials: true,
        });
    }

    getOneUserById = (userid:string) => {
      return this.http.get<{data:User, message:string}>(`${this.baseUrl}user/getOneUserById/${userid}`, {
            withCredentials: true,
        })
    }

}
