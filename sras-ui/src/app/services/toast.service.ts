import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private base: MatSnackBarConfig = { duration: 3500, horizontalPosition: 'right', verticalPosition: 'top' };

  constructor(private snackBar: MatSnackBar) {}

  success(message: string): void {
    this.snackBar.open(message, '✕', { ...this.base, panelClass: ['toast', 'toast-success'] });
  }

  error(message: string): void {
    this.snackBar.open(message, '✕', { ...this.base, duration: 5000, panelClass: ['toast', 'toast-error'] });
  }

  info(message: string): void {
    this.snackBar.open(message, '✕', { ...this.base, panelClass: ['toast', 'toast-info'] });
  }
}
