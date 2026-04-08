import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { consoleInterceptor } from './core/interceptors/console.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideClientHydration(withEventReplay()),
    provideHttpClient(
       withInterceptors([
        loadingInterceptor,
        authInterceptor,
        consoleInterceptor,
        errorInterceptor,
      ])

    ), 
    provideTranslateService({
          loader: provideTranslateHttpLoader({prefix:"/assets/i18n/"}),
            fallbackLang: 'en', // de respaldo
            lang: 'es' // inicial
        })
  ],
};


