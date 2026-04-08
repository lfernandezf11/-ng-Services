import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.getToken();
    const headers: { [key: string]: string } = {};

    if (token) {
        headers['Authorization'] = `Bearer ${token}`; // La primera vez no hay nada en el localStorage, la cabecera no está. 
    }

    // Puesto que para acceder a la ruta /admin se requiere la cabecera X-Admin, adición haya token o no.
    if (req.url.includes('/admin')) {
        headers['X-Admin'] = 'true';
    }
    console.log(`Revisando petición a ${req.url}`);
    console.log(`Cabeceras a añadir:`, headers);

    if (Object.keys(headers).length > 0) {
        const authReq = req.clone({ setHeaders: headers });
        return next(authReq);

    }
    return next(req);  // Si no hay token, la petición sigue su curso original
}

