import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { Tokens } from '../_models/token';
import { config } from '../_config/config'
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private loggedUser: string;

  constructor(private http: HttpClient) { }

  login(user: { username: string, password: string }): Observable<boolean> {
    return this.http.post<any>(`${config.apiUrl}/signin`, user)
      .pipe(
        tap(tokens => this.doLoginUser(user.username, tokens)),
        mapTo(true),
        catchError(error => {
          alert(error.err['message']);
          return of(false);
        }));
  }

  logout() {
    return this.http.post<any>(`${config.apiUrl}/logout`, {
      'refreshToken': this.getRefreshToken()
    }).pipe(
      tap(() => this.doLogoutUser()),
      mapTo(true),
      catchError(error => {
        console.log(error)
        alert(error.err['message']);
        return of(false);
      }));
  }

  register(userInfo){
    console.log(userInfo)
     return this.http.post<any>(`${config.apiUrl}/signup`, {
     userInfo
    }).pipe(
      mapTo(true),
      catchError(error => {
        console.log(error)
        alert(error.err['message']);
        throw error;
      }));
  }
  isLoggedIn() {
    return !!this.getJwtToken()
  }

  refreshToken() {
    return this.http.post<any>(`${config.apiUrl}/refreshAccessToken`, {
      'refreshToken': this.getRefreshToken()
    }).pipe(tap((tokens: Tokens) => {
      this.storeJwtToken(tokens.access_token);
    }));
  }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  private doLoginUser(username: string, tokens: Tokens) {
    this.loggedUser = username;
    this.storeTokens(tokens);
  }

  private doLogoutUser() {
    console.log('123')
    this.loggedUser = null;
    this.removeTokens();
  }

  private getRefreshToken() {

    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  private storeJwtToken(access_token: string) {
    localStorage.setItem(this.JWT_TOKEN, access_token);
  }

  private storeTokens(tokens: Tokens) {
    localStorage.setItem(this.JWT_TOKEN, tokens.access_token);
    localStorage.setItem(this.REFRESH_TOKEN, tokens.refresh_token);
  }

  private removeTokens() {

    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }

 
}