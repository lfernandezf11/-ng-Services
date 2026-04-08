import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LogUser } from '../models/logUser';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Verificamos físicamente si existe el objeto 'window', es decir, el entorno de ejecución es el navegador
  private isBrowser = typeof window !== 'undefined';
  private baseUrl = 'http://localhost:3000';

  private http = inject(HttpClient);
  private router = inject(Router);

  isAuthenticated = signal<boolean>(
    this.isBrowser ? !!localStorage.getItem('token') : false
  );

  user = signal<LogUser | null>(
    this.isBrowser ? JSON.parse(localStorage.getItem('user') || 'null') : null
  );

  getToken() {
    return this.isBrowser ? localStorage.getItem('token') : null;
  }
// Fase 6 → Agregar una cabecera personalizada solo para ciertas rutas.

// Si la URL de la petición contiene /admin, añade una cabecera especial X-Admin: true. Si no, deja la petición normal.

  login(name: string, password: string): Observable<boolean> {

    const endpoint = name.toLocaleLowerCase().includes('admin') ? 'admin' : 'users';
    const apiUrl = `${this.baseUrl}/${endpoint}`;

    return this.http.get<LogUser[]>(`${apiUrl}?name=${name}&password=${password}`).pipe(
      map(users => {
        // Si el array contiene al menos un elemento, las credenciales son correctas
        if (users.length > 0) {

          if (this.isBrowser) {
            localStorage.setItem('token', 'current-user-token'); // llave de ejemplo, en un caso real se debería usar un token seguro
            localStorage.setItem('user', JSON.stringify(users[0]));
          }
          this.isAuthenticated.set(true);
          this.user.set(users[0]);
          return true;
        } else {
          this.logout();
          return false;
        }
      })
    );
  }

  logout() {
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.isAuthenticated.set(false);
    this.user.set(null);
    this.router.navigate(['/login']);
  }
}

