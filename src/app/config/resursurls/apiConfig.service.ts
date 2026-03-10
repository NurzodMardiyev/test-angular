import {Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable} from "rxjs";
import {ApiUrls, FindResultApiUrl} from "./apiConfigDto";
import {apiConfigData} from "./apiConfigData";
import {HttpClient} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  private apiConfigSubject = new BehaviorSubject<ApiUrls[]>([]);
  private findResultUrl = new BehaviorSubject<FindResultApiUrl | null>(null);
  private userRoles: string[] = [];

  apiConfigSubject$ = this.apiConfigSubject.asObservable();

  constructor(
    private httpClient: HttpClient,
    private translateService: TranslateService,
  ) {
    this.apiConfigSubject.next(apiConfigData);
  }

  setUserRoles(roles: string[]) {
    this.userRoles = roles;
  }

  // pingServer(host: string): Observable<boolean> {
  //   return this.httpClient.get(`${host}`, { observe: 'response', responseType: 'text' }).pipe(
  //     map(() => true),
  //     catchError(() => of(false))
  //   );
  // }

  loadConfigAndGetResultUrl(moduleName: string, label: string): Observable<FindResultApiUrl | null> {
    return this.apiConfigSubject$.pipe(
      map(config => {
        const moduleResult = config.find(mod => mod.module === moduleName && mod.active);
        if (moduleResult) {
          const selectedUrls = moduleResult.list.filter(subModule =>
            subModule.label === label &&
            subModule.active &&
            (
              !subModule.roles ||
              subModule.roles.length === 0 ||
              subModule.roles.some(role => this.userRoles.includes(role)) // Или у пользователя есть нужная роль
            )
          );

          if (selectedUrls.length > 0) {
            const fullMatch = selectedUrls.find(sub =>
              sub.roles?.some(role =>
                role.endsWith('_FULL') && this.userRoles.includes(role)
              )
            );
            const selectedUrl = fullMatch ?? selectedUrls[0];

            // const selectedUrl = selectedUrls[0];

            // this.pingServer(moduleResult.host).subscribe(isOnline => {
            //   if (!isOnline) {
            //     this.dialogService.open(ModalDialogComponent, {
            //       header: this.translateService.instant(MessageEnum.CONNECTION_REFUSED),
            //       data: {
            //         messageDetail: this.translateService.instant(MessageEnum.CONNECTION_REFUSED_DETAIL),
            //       },
            //       styleClass: 'custom-modal',
            //       closable: true,
            //     });
            //   }
            // });
            const result: FindResultApiUrl = {
              host: moduleResult.host,
              ssl: moduleResult.ssl,
              url: selectedUrl.url,
              method: selectedUrl.method,
              label: selectedUrl.label,
              comment: selectedUrl.comment,
            };
            this.findResultUrl.next(result);
            return result;
          }
        }
        return null;
      })
    );
  }


  loadConfigByModule(moduleName: string) {
    return this.apiConfigSubject$.pipe(
      map(config => {
        return config.find(mod => mod.module === moduleName && mod.active);
      })
    );
  }
}
