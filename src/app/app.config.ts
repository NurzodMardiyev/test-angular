import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';

import BluePreset from './config/presets/BluePreset';
import {provideTranslateService} from '@ngx-translate/core';
import {provideTranslateHttpLoader} from '@ngx-translate/http-loader';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {languageInterceptor} from './config/interceptors/language.interceptor';
import {DialogService} from 'primeng/dynamicdialog';
import {httpCodeInterceptor} from './config/interceptors/httpcode.interceptor';
import {MessageService} from 'primeng/api';

const host = "172.16.212.11"
const keycloakPort = 8080;

// const globalCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
//   urlPattern: /.*/,
//   bearerPrefix: 'Bearer'
// });

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    DialogService,
    MessageService,
    provideHttpClient(withInterceptors([
      httpCodeInterceptor,
      languageInterceptor
    ])),
    providePrimeNG({
      theme: {preset: BluePreset, options: {darkModeSelector: '.p-dark'}},
    }),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: './i18n/',
        suffix: '.json'
      }),
      defaultLanguage: 'oz'
    }),
    // provideKeycloak({
    //   config: {
    //     url: `http://${host}:${keycloakPort}`,
    //     realm: 'spto-realm',
    //     clientId: 'spto'
    //   },
    //   initOptions: {
    //     refreshToken: '3000',
    //     onLoad: 'check-sso',
    //     silentCheckSsoRedirectUri: '/silent-check-sso.html',
    //     checkLoginIframe: true
    //   },
    //   features: [
    //     withAutoRefreshToken({
    //       sessionTimeout: Infinity,
    //       onInactivityTimeout: 'none'
    //     })
    //   ],
    //   providers: [AutoRefreshTokenService, UserActivityService]
    // }),
    // {provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG, useValue: [globalCondition]},
  ]
};
