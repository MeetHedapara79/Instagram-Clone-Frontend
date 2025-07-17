import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-signin',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
})
export class SigninComponent implements OnInit {
  signinForm: FormGroup;
  passwordVisible: boolean = false; 
  errorMessage: string = '';

  constructor(public _authService: AuthService, private router: Router, private _cookieService: CookieService) {
    this.signinForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        this.usernameValidator,
      ]),
      password: new FormControl('', [
        Validators.required,
      ]),
    });
  }

  ngOnInit(): void {
    this._cookieService.delete('authToken');

  }

   togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  usernameValidator(control: FormControl): { [key: string]: boolean } | null {
    if(control.value.trim().length > 0) {
      return null;
    }
    return { invalidUsername: true };
  }

  onSubmit(): void {
    if (this.signinForm.invalid) {
      return;
    }
    this._authService.signinUser(this.signinForm.value).subscribe(
      (response) => {
        this.router.navigate(['/home/homePage']);
      },
      (error) => {
        this.errorMessage = error.error.message;
        console.error('Login failed', error);

      }
    );
  }
}
