import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  loading = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['EMPLOYEE', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.authService.signup(this.form.value as any).subscribe({
      next: (res) => {
        this.loading = false;
        this.toast.success('Account created! Welcome to SRAS.');
        this.router.navigate([res.role === 'PROJECT_MANAGER' ? '/projects' : '/employees']);
      },
      error: err => {
        this.loading = false;
        // Prefer the server's field-level validation errors, then the top-level
        // message, then a safe fallback — never shows a raw technical string.
        const fieldErrors = err.error?.errors as Record<string, string> | undefined;
        const serverMsg  = fieldErrors
          ? Object.values(fieldErrors).join(' · ')
          : err.error?.message;
        this.toast.error(serverMsg ?? 'Signup failed. Please try again.');
      }
    });
  }
}
