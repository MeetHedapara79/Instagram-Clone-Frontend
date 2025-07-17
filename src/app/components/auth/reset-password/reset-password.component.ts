import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  resetPwdForm: FormGroup;
  passwordVisible: boolean = false; 
  errorMessage: string = '';
  recoveryCode: string = '';
  showRecoveryModal: boolean = false;
  codeDownloaded: boolean = false;

  constructor(public _authService: AuthService, private router: Router) {
    this.resetPwdForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        this.usernameValidator,
      ]),
      password: new FormControl('', [
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

  generateRecoveryCode(): string {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  downloadRecoveryCode() {
    const username = this.resetPwdForm.value.username;
    const fileName = `${username}_recoverycode.txt`;
    const blob = new Blob([`New Recovery Code for ${username}:\n${this.recoveryCode}`], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
  
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
  
    window.URL.revokeObjectURL(url);
    this.codeDownloaded = true;
  }

  goToLogin() {
    this.router.navigate(['/']);
    this.showRecoveryModal = false;
  }

  onSubmit(): void {
    if (this.resetPwdForm.invalid) {
      console.log('Form is invalid');
      return;
    }

    this.errorMessage = '';
    this.recoveryCode = this.generateRecoveryCode();
    
    const userPayload = {
      ...this.resetPwdForm.value,
      recoveryCode: this.recoveryCode,
    };
    this
    this._authService.resetPassword(userPayload).subscribe(
      (response) => {
        this.showRecoveryModal = true;
      },
      (error) => {
        this.errorMessage = error.error.message;
      }
    );
  }
}
