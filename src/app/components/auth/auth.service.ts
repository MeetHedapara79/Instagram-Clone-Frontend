import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ForgotPasswordValidate, RegisterUserValidate, ResetPasswordValidate, SigninUserValidate } from './auth.types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  signinUser = (user: SigninUserValidate) => {
    return this.http.post(`${this.baseUrl}auth/signin`, user, {
      withCredentials: true,
    });
  };

  resetPassword = (user: ResetPasswordValidate) => {
    return this.http.post(`${this.baseUrl}auth/resetPassword`, user, {
      withCredentials: true,
    });
  };

  registerUser = (user: RegisterUserValidate) => {
    return this.http.post(`${this.baseUrl}auth/register`, user, {
      withCredentials: true,
    });
  };

  forgotPassword = (user: ForgotPasswordValidate) => {
    return this.http.post(`${this.baseUrl}auth/forgotPassword`, user, {
      withCredentials: true,
    });
  };

  logoutUser = () => {
    return this.http.get(`${this.baseUrl}auth/logout`, {
      withCredentials: true,
    });
  }
}
