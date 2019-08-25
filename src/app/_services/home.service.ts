import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of,Observable } from 'rxjs';
import { catchError ,mapTo} from 'rxjs/operators';
import { config } from '../_config/config'
@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }
  getProfile(): Observable<any> {
    return this.http.get<any>(`${config.apiUrl}/profile`)
      .pipe(
        catchError(error => {
          console.log(error)
          alert(error.err);
          throw error
        }));
  }

  updateProfile(editFields): Observable<boolean> {
    return this.http.post<any>(`${config.apiUrl}/profile`,editFields)
    .pipe(
      mapTo(true),
        catchError(error => {
          console.log(error)
          alert(error.err);
          return of(false);
        }));
  }
}
