import {HttpErrorResponse, HttpInterceptorFn, HttpResponse} from '@angular/common/http';
import {inject} from '@angular/core';
import {catchError, tap, throwError} from 'rxjs';
import {ValidationService} from '../../service/validations/validation.service';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {apiConfigData} from '../resursurls/apiConfigData';
import {FormStateService} from '../states/form-state.service';
import {MessageEnum} from '../../service/enums/MessageEnum';

export const httpCodeInterceptor: HttpInterceptorFn = (req, next) => {
  const validationService = inject(ValidationService);
  const formStateService = inject(FormStateService);
  const messageService = inject(MessageService);
  const translateService = inject(TranslateService);

  const findApiConfig = (url: string, method: string) => {
    for (const module of apiConfigData) {
      for (const api of module.list) {
        if (req.url.includes(api.url) && api.method === method) {
          return api;
        }
      }
    }
    return null;
  };

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const apiConfig = findApiConfig(req.url, req.method);

      if (apiConfig?.showWarning && error.status === 400) {
        const forms = formStateService.getForms();

        for (const form of forms) {
          validationService.handleApiErrors(error.error.data.errors, form);
        }

        messageService.add({
          severity: 'error',
          summary: translateService.instant(MessageEnum.CONFIRM_REJECT),
          detail: translateService.instant(MessageEnum.CONFIRM_REJECT_400),
        });
      }

      if ((apiConfig?.showWarning && error.status === 403)) {
        messageService.add({
          severity: 'error',
          summary: translateService.instant(MessageEnum.CONFIRM_REJECT),
          detail: error.error.message,
        });
      }

      if (apiConfig?.showWarning && error.status === 404) {
        messageService.add({
          severity: 'error',
          summary: translateService.instant(MessageEnum.CONFIRM_REJECT),
          detail: error.error.message,
        });
      }

      if (apiConfig?.showWarning && error.status === 409) {
        messageService.add({
          severity: 'error',
          summary: translateService.instant(MessageEnum.CONFIRM_REJECT),
          detail: error.error.message,
        });
      }

      if (apiConfig?.showWarning && error.status === 422) {
        messageService.add({
          severity: 'error',
          summary: translateService.instant(MessageEnum.CONFIRM_REJECT),
          detail: error.error.message,
        });
      }

      if (error.status === 429 && error.error instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const errorJson = JSON.parse(reader.result as string);
            const errorMessage = errorJson?.message || 'Xatolik yuz berdi';

            messageService.add({
              severity: 'error',
              summary: translateService.instant(MessageEnum.CONFIRM_REJECT),
              detail: errorMessage
            });
          } catch {
            messageService.add({
              severity: 'error',
              summary: 'Xatolik',
              detail: 'Xatolik maʼlumotini o‘qib bo‘lmadi'
            });
          }
        };
        reader.readAsText(error.error);
      }

      if (apiConfig?.showWarning && error.status === 500) {
        messageService.add({
          severity: 'error',
          summary: translateService.instant(MessageEnum.CONFIRM_REJECT),
          detail: translateService.instant(MessageEnum.CONFIRM_REJECT_404),
        });
      }

      return throwError(() => error);
    }),
    tap((event) => {
      if (event instanceof HttpResponse) {
        const apiConfig = findApiConfig(req.url, req.method);

        if (apiConfig?.showSuccess) {
          if (event.status === 200) {
            messageService.add({
              severity: 'success',
              summary: translateService.instant(MessageEnum.CONFIRM_SUCCESS),
              detail: translateService.instant(MessageEnum.CONFIRM_SUCCESS_200),
            });
          }

          if (event.status === 204) {
            messageService.add({
              severity: 'success',
              summary: translateService.instant(MessageEnum.CONFIRM_SUCCESS),
              detail: translateService.instant(MessageEnum.CONFIRM_SUCCESS_204),
            });
          }

          if (event.status === 302) {
            const redirectUrl = event.headers.get('Location');
            if (redirectUrl) {
              window.location.href = redirectUrl;  // Foydalanuvchini Magic Linkga yo'naltirish
            }
          }
        }
      }
    })
  );
};
