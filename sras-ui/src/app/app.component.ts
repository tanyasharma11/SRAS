import { Component, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressBarModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  isVerifying = computed(() => this.authService.verifying());
  isLoggedIn  = computed(() => !!this.authService.currentUser());
  isManager   = computed(() => this.authService.currentUser()?.role === 'PROJECT_MANAGER');
  userEmail   = computed(() => this.authService.currentUser()?.email ?? '');

  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
