import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FilterMetadata } from '../shared/models/filter-metadata';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  readonly apiURL = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  // this method will transform LazyLoadEvent to url query string
  getUsers(globalFilter: (string | null | undefined), filters: FilterMetadata[], maxResultCount: (number | null | undefined), skipCount: (number | null | undefined)): Observable<any> {
    let url = this.apiURL + '/api/Users/GetUsers?';
    if (globalFilter !== undefined && globalFilter !== ''){
      url += "GlobalFilter=" + encodeURIComponent('' + globalFilter) + '&';
    }
    if (filters !== undefined && filters.length !== 0){
      url += this.decodedFiltersToUrl(filters);
    }
    if (maxResultCount !== undefined){
      url += "MaxResultCount=" + encodeURIComponent('' + maxResultCount) + '&';
    }
    if (skipCount !== undefined){
      url += "SkipCount=" + encodeURIComponent('' + skipCount) + '&';
    }
    url = url.replace(/[?&]$/, '');
    console.log(url);
    return this.http.get(url).pipe(delay(500));
  }

  decodedFiltersToUrl(filters: FilterMetadata[]): string{
    let url = '';
    filters.forEach(x => {
      url += `${x.key}=` + encodeURIComponent('' + x.value) + '&';
    });
    return url;
  }

}
