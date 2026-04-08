import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, tap, throwError } from "rxjs";
import { AuthService } from "../../services/auth.service";


export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => { // Los errores no devuelven un HttpResponse, sino un HttpErrorResponse
            // Registro global del error en la consola
            console.error(`Error HTTP en la respuesta del servidor: [${error.status}] ${error.message}`);

            if (error.status === 401) {
                console.warn('Sesión expirada o no autorizada.');
                authService.logout(); 
                router.navigate(['/login']);
            }
            // Se propaga el error para que el componente que hizo la llamada pueda manejarlo
            return throwError(() => error);
        })
    );
};