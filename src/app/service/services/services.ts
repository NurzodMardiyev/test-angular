import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of, switchMap} from 'rxjs';
import {FindResultApiUrl} from '../../config/resursurls/apiConfigDto';
import {ApiConfigService} from '../../config/resursurls/apiConfig.service';
import {ResponseDto} from '../../config/resursurls/responseDto';
import {DatatableService} from '../../component/datatable/datatable.service';
import {
  DataTableInput,
  ResponseDtoForDataTableOutput
} from '../../component/datatable/datatable-input.model';

@Injectable({
  providedIn: 'root'
})
export class Services {
  private moduleUrl!: FindResultApiUrl;

  constructor(
    public http: HttpClient,
    private datatableService: DatatableService,
    private apiConfigService: ApiConfigService
  ) {}

  /** create */
  create(formData: any, key: string) {
    return this.apiConfigService.loadConfigAndGetResultUrl('services', 'create_' + key).pipe(
      switchMap(value => {
        if (value) {
          this.moduleUrl = value;
          console.log(this.moduleUrl);
          return this.http.post<ResponseDto>(`${this.moduleUrl.host}${this.moduleUrl.url}`, formData);
        } else {
          throw new Error('for development: URL not found');
        }
      })
    );
  }

  /** update */
  update(formData: any, key: string, id: string) {
    return this.apiConfigService.loadConfigAndGetResultUrl('services', 'update_' + key).pipe(
      switchMap(value => {
        if (value) {
          this.moduleUrl = value;
          console.log(this.moduleUrl);
          return this.http.patch<ResponseDto>(`${this.moduleUrl.host}${this.moduleUrl.url}/`+ `${id}`, formData);
        } else {
          throw new Error('for development: URL not found');
        }
      })
    );
  }

  /** datatable */
  datatable(dataTableInput: DataTableInput, key: string): Observable<ResponseDtoForDataTableOutput<Object>> {
    this.apiConfigService.loadConfigAndGetResultUrl('services', 'datatable_' + key).subscribe(value => {
      if (value) {
        console.log(value)
        this.moduleUrl = value;
      }
    })
    return this.datatableService.getData<Object>(this.moduleUrl.host + this.moduleUrl.url, dataTableInput);
  }

  pintin_url(key: string): Observable<Object> {
    return this.http.get<Object>('https://gnk-api.didox.uz/api/v1/utils/info/' + key);
  }

}
