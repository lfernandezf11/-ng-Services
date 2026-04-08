import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { LoadingService } from "../../services/loading.service";
import { finalize } from "rxjs";

// Usar un BehaviourSubject<boolean> dentro de un LoadingService para controlar el estado.
// El interceptor solo modifica el estado, no muestra directamente el spinner.

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
    const loadingService = inject(LoadingService);
    loadingService.setLoading(true);

    return next(req).pipe(
        finalize(() => { // Se ejecuta siempre.
             // Simula un retraso para que el spinner sea visible. 
             // Añade el tiempo al de respusta de la petición (sólo para pruebas, no en producción).
            setTimeout(() => {
                loadingService.setLoading(false);
            }, 800);
        })
    );
};