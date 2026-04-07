import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Verificamos físicamente si existe el objeto 'window'
  private isBrowser = typeof window !== 'undefined';
  router = inject(Router);

  isAuthenticated = signal<boolean>(
    this.isBrowser ? !!localStorage.getItem('token') : false
  );

  login(name: string, password: string) : boolean {
    if (name === 'admin' && password === '1234A') {
      localStorage.setItem('token', 'token-value');
      this.isAuthenticated.set(true);
      return true;
    } else {
      this.logout();
      return false;
    }
  }

  logout() {
    if (this.isBrowser) {
      localStorage.removeItem('token');
    }
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }
}
