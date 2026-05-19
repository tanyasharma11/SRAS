import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subject, tap, catchError, throwError, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse, LoginRequest, SignupRequest } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  /**
   * Emits once whenever the user explicitly logs out.
   * Components can pipe takeUntil(this.authService.logout$) to cancel
   * any in-flight requests when the session ends.
   */
  private readonly _logout$ = new Subject<void>();
  readonly logout$ = this._logout$.asObservable();

  /**
   * Starts as `null` — the real value is populated *after* the server
   * confirms the stored token is still valid (see verifySession).
   */
  currentUser = signal<AuthResponse | null>(null);

  /**
   * True while the initial session-verification call is in flight.
   * The navbar should stay hidden (or show a skeleton) until this is false.
   */
  verifying = signal<boolean>(true);

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Called once by APP_INITIALIZER before the app renders.
   * Hits GET /auth/validate — the server re-validates the stored JWT.
   * On success  → populates currentUser from fresh server data.
   * On 401/error → wipes stale localStorage so the navbar stays empty.
   */
  verifySession(): Observable<AuthResponse | null> {
    const token = localStorage.getItem('sras_token');

    if (!token) {
      this.verifying.set(false);
      return of(null);
    }

    return this.http.get<AuthResponse>(`${this.apiUrl}/validate`).pipe(
      tap(response => {
        this.saveSession(response);
        this.verifying.set(false);
      }),
      catchError(() => {
        // 401 or network error — treat as unauthenticated and clear stale data
        this.clearSession();
        this.verifying.set(false);
        return of(null);
      })
    );
  }

  signup(request: SignupRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, request).pipe(
      tap(response => this.saveSession(response)),
      catchError(err => {
        console.error('[AuthService] signup failed', {
          status:  err.status,
          body:    err.error,
          message: err.error?.message ?? err.message
        });
        return throwError(() => err);
      })
    );
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => this.saveSession(response)),
      catchError(err => {
        console.error('[AuthService] login failed', {
          status:  err.status,
          body:    err.error,
          message: err.error?.message ?? err.message
        });
        return throwError(() => err);
      })
    );
  }

  logout(): void {
    this._logout$.next();   // signal active subscriptions to cancel
    this.clearSession();    // wipe token + user from localStorage and signal
    this.router.navigate(['/']);  // return to public home, not login
  }

  getToken(): string | null {
    return localStorage.getItem('sras_token');
  }

  isLoggedIn(): boolean {
    return !!this.currentUser();
  }

  isManager(): boolean {
    return this.currentUser()?.role === 'PROJECT_MANAGER';
  }

  private saveSession(response: AuthResponse): void {
    localStorage.setItem('sras_token', response.token);
    localStorage.setItem('sras_user', JSON.stringify(response));
    this.currentUser.set(response);
  }

  private clearSession(): void {
    localStorage.removeItem('sras_token');
    localStorage.removeItem('sras_user');
    this.currentUser.set(null);
  }
}
