import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage:string = "";
  passwordVisible: boolean = false; 
  recoveryCode: string = '';
  showRecoveryModal: boolean = false;
  codeDownloaded: boolean = false;


  constructor(public _authService: AuthService, private router: Router) {
    this.registerForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        this.usernameValidator,
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      emailphone: new FormControl('', [
        Validators.required,
        this.phoneEmailValidator,
      ]),
    });
  }

  ngOnInit(): void {}

   togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  usernameValidator(control: FormControl): { [key: string]: boolean } | null {

    if (control.value.trim().length > 0) {
      return null;
    }
    return { invalidUsername: true };
  }

  phoneEmailValidator(control: FormControl): { [key: string]: boolean } | null {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phonePattern = /^[0-9]{10}$/;

    if (control.value.trim().length > 0) {
      if (phonePattern.test(control.value)) {
        return null;
      } 
      else{
        if(emailPattern.test(control.value)){
          return null;
        }
        else{
          return { invalidEmailPhone: true };
        }
      }

    }
    return { invalidEmailPhone: true };
  }

  generateRecoveryCode(): string {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  downloadRecoveryCode() {
    const username = this.registerForm.value.username;
    const fileName = `${username}_recoverycode.txt`;
    const blob = new Blob([`Recovery Code for ${username}:\n${this.recoveryCode}`], { type: 'text/plain' });
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
    if (this.registerForm.invalid) {
      console.log('Form is invalid');
      return;
    }
    this.errorMessage = '';
    this.recoveryCode = this.generateRecoveryCode();
    
    const userPayload = {
      ...this.registerForm.value,
      recoveryCode: this.recoveryCode,
    };
        
    this._authService.registerUser(userPayload).subscribe(
      (response) => {
        this.showRecoveryModal = true;
      },
      (error) => {
        this.errorMessage = error.error.message;
      }
    );
  }
}
