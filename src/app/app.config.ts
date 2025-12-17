// src/app/app.config.ts
import {ApplicationConfig, importProvidersFrom, provideZonelessChangeDetection} from '@angular/core';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {DeviceDetectorService} from 'ngx-device-detector';
import {provideHttpClient} from '@angular/common/http';
import Aura from '@primeuix/themes/aura';

// ngx-translate v17 importlari
import {TranslateModule} from '@ngx-translate/core';
import {provideTranslateHttpLoader} from '@ngx-translate/http-loader';
import {providePrimeNG} from 'primeng/config';
import MyPreset from './configs/presets/defpreser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideZonelessChangeDetection(),
    provideAnimations(),
    provideHttpClient(),
    providePrimeNG({
      theme: {
        preset: MyPreset
      }
    }),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: provideTranslateHttpLoader({
          prefix: '/assets/i18n/',
          suffix: '.json'
        }),
        useDefaultLang: true,
        fallbackLang: 'uz'
      })
    ),

    DeviceDetectorService
  ]
};
