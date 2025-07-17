import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  forgotPwdForm: FormGroup;
  passwordVisible: boolean = false; 
  errorMessage: string = '';

  constructor(public _authService: AuthService, private router: Router) {
    this.forgotPwdForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        this.usernameValidator,
      ]),
      recoveryCode: new FormControl('', [
        Validators.required,
      ]),
    });
  }

  ngOnInit(): void {}

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
    if (this.forgotPwdForm.invalid) {
      console.log('Form is invalid');
      return;
    }
    this._authService.forgotPassword(this.forgotPwdForm.value).subscribe(
      (response) => {
        console.log(response);
        this.router.navigate(['/resetpassword']);
      },
      (error) => {
        this.errorMessage = error.error.message;
        console.error('Login failed', error);
      }
    );
  }
}
