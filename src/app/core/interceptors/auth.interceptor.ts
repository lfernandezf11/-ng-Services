import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    // En un caso real, se debería obtener el token de un servicio, ej.:
    //  const authService = inject(AuthService);
    //  const token = authService.getToken()
    const token = 'fake-token-123'

    if (token) {
        const authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        // Log para ver la petición clonada en la consola del navegador
        // console.log('Interceptor añade token a:', authReq.url);
        // console.log('Cabeceras:', authReq.headers.get('Authorization'));
        return next(authReq);
    }

    return next(req);  // Si no hay token, la petición sigue su curso original
};