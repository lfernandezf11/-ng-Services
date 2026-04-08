import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs';

export const consoleInterceptor: HttpInterceptorFn = (req, next) => {
    console.log(`Petición HTTP: ${req.method} ${req.url}`);
    return next(req).pipe(
        tap({ // tap permite ejecutar código (efectos secundarios) sin modificar la respuesta
            next: (event) => {
                if (event instanceof HttpResponse) {
                    console.log(`Respuesta HTTP exitosa: ${event.status} ${event.statusText}`);
                }
            }
        })
    );
};