import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
//import { LoggerService } from './logger.service';

import { JwtHelperService } from '@auth0/angular-jwt';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Utilities } from '../shared/utilities';
import { ResponseResult, ResponseResultCode } from '../models/response-result.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly TOKEN_NAME = 'access_token';
  private authApiUrl: string;

  constructor(
    private http: HttpClient, 
    private jwtHelperService: JwtHelperService,
    private messageService: MessageService,
    //private loggerService: LoggerService, 
    private router: Router) {
    this.authApiUrl = environment.API_URL + 'auth';
  }

  public isAuthenticated() : boolean {
    let authenticated = this.tokenIsActive();
  
    return authenticated;
  }

  get currentUserId() {
    let userId: number;

    if (this.isAuthenticated()) {
      userId = +localStorage.getItem('userId');
      
      if(!userId || userId <= 0)
        userId = +sessionStorage.getItem('userId');
    }

    return userId;
  }

  tokenIsActive() {
    let token = localStorage.getItem(this.TOKEN_NAME);
    token ??= sessionStorage.getItem(this.TOKEN_NAME);
    if (token && !this.jwtHelperService.isTokenExpired(token)) {
      return true;
    }

    return false;
  }

  async tokenAuth(token: string, remember: boolean = false) {
    try {
      let result = await this.http.get<ResponseResult>
        (this.authApiUrl + '/login/token/' + token).toPromise();
  
      if(result?.code == ResponseResultCode.Failed)
        this.messageService.add({ severity: 'error', summary: 'Login Failed', detail: result.message });
  
      if(result?.code == ResponseResultCode.Success) {
        if(remember) {
          localStorage.setItem(this.TOKEN_NAME, result.value.apiToken);
          localStorage.setItem('userId', result.value.id.toString());

          sessionStorage.removeItem(this.TOKEN_NAME);
          sessionStorage.removeItem('userId');
        }
        else {
          sessionStorage.setItem(this.TOKEN_NAME, result.value.apiToken);
          sessionStorage.setItem('userId', result.value.id.toString());

          localStorage.removeItem(this.TOKEN_NAME);
          localStorage.removeItem('userId');
        }
        this.router.navigate(['/']);
      }
    }
    catch(err: any) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
      //this.loggerService.error(err.error);
    }
  }

  async login(loginData: { email: string, password: string }, remember: boolean = false) {
    let body = JSON.stringify(loginData);

    try {
      let result = await this.http.post<ResponseResult>
        (this.authApiUrl + '/login', body,
          { headers: Utilities.getDefaultHttpHeaders() }).toPromise();
  
      if(result?.code == ResponseResultCode.Failed)
        this.messageService.add({ severity: 'error', summary: 'Login Failed', detail: result.message });
  
      if(result?.code == ResponseResultCode.Success) {
        if(remember) {
          localStorage.setItem(this.TOKEN_NAME, result.value.apiToken);
          localStorage.setItem('userId', result.value.id.toString());
        }
        else {
          sessionStorage.setItem(this.TOKEN_NAME, result.value.apiToken);
          sessionStorage.setItem('userId', result.value.id.toString());
        }
    
        this.router.navigate(['/']);
      }
    }
    catch(err: any) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
      //this.loggerService.error(err.error);
    }
  }

  async register(loginData: { name: string, email: string, password: string, preferredCurrencyCode: string }) {
    let body = JSON.stringify(loginData);

    try {
      let result = await this.http.post<ResponseResult>
        (this.authApiUrl + '/register', body,
          { headers: Utilities.getDefaultHttpHeaders() }).toPromise();
  
      if(result?.code == ResponseResultCode.Failed)
        this.messageService.add({ severity: 'error', summary: 'Register Failed', detail: result.message });
  
      if(result?.code == ResponseResultCode.Success) {
        //CONFIRM EMAIL
      }
    }
    catch(err: any) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
      //this.loggerService.error(err.error);
    }
  }

  logout() {
    localStorage.removeItem(this.TOKEN_NAME);
    localStorage.removeItem('userId');

    sessionStorage.removeItem(this.TOKEN_NAME);
    sessionStorage.removeItem('userId');

    this.router.navigate(['/login']);
  }
}
