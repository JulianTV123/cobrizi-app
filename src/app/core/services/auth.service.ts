import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { API_ENDPOINTS } from '../../shared/constants';
import { ILoginResponse, IUser, IUserCreate } from '../../shared/interfaces';

// TODO: Reemplazar sessionStorage por httpOnly cookie + refresh token
// para mayor seguridad contra ataques XSS y CSRF

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  // TODO: Migrar a httpOnly cookie cuando se implemente refresh token en el backend
  private readonly _token = signal<string | null>(sessionStorage.getItem('token'));
  private readonly _currentUser = signal<IUser | null>(null);

  readonly token = computed(() => this._token());
  readonly currentUser = computed(() => this._currentUser());
  readonly isLoggedIn = computed(() => !!this._token());

  register(data: IUserCreate): Observable<IUser> {
    return this.http.post<IUser>(API_ENDPOINTS.auth.register, data);
  }

  login(email: string, password: string): Observable<ILoginResponse> {
    const form = new FormData();
    form.append('username', email);
    form.append('password', password);

    return this.http.post<ILoginResponse>(API_ENDPOINTS.auth.login, form).pipe(
      tap((res) => {
        // TODO: Migrar a httpOnly cookie
        sessionStorage.setItem('token', res.access_token);
        this._token.set(res.access_token);
      }),
    );
  }

  setCurrentUser(user: IUser): void {
    this._currentUser.set(user);
  }

  logout(): void {
    // TODO: Limpiar httpOnly cookie desde el backend al migrar
    sessionStorage.removeItem('token');
    this._token.set(null);
    this._currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }
}
