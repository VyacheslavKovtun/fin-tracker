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
    let userId: string;

    if (this.isAuthenticated()) {
      userId = localStorage.getItem('userId');
      
      if(!userId)
        userId = sessionStorage.getItem('userId');
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
        this.messageService.add({ severity: 'info', summary: 'Confirm Email', detail: 'Confirmation was sent to your email' });
      }
    }
    catch(err: any) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
      //this.loggerService.error(err.error);
    }
  }

  async confirmEmail(userId: string, token: string) {
    try {
      let result = await this.http.get<{ message: string }>
        (this.authApiUrl + `/confirm-email?userid=${userId}&token=${token}`,
          { headers: Utilities.getDefaultHttpHeaders() }).toPromise();
  
      this.messageService.add({
        severity: 'success',
        summary: 'Email Confirmation',
        detail: result?.message || 'Email confirmed.'
      });

      this.router.navigate(['/login']);
    }
    catch(err: any) {
      this.messageService.add({ severity: 'error', summary: 'Confirmation Failed', detail: err.error?.message });
    }
  }

  async sendPasswordReset(email: string) {
    try {
      let result = await this.http.get<{ message: string }>
        (this.authApiUrl + `/send-reset-password?email=${email}`,
          { headers: Utilities.getDefaultHttpHeaders() }).toPromise();
  
      this.messageService.add({
        severity: 'success',
        summary: 'Password Reset',
        detail: result?.message || 'Reset link was sent to your email.'
      });
    }
    catch(err: any) {
      this.messageService.add({ severity: 'error', summary: 'Reset Failed', detail: err.error?.message });
    }
  }

  async resetPassword(resetData: { userId: string, token: string, newPassword: string }) {
    let body = JSON.stringify(resetData);

    try {
      let result = await this.http.post<{ message: string }>
        (this.authApiUrl + `/reset-password`, body,
          { headers: Utilities.getDefaultHttpHeaders() }).toPromise();
  
      this.messageService.add({
        severity: 'success',
        summary: 'Password Reset',
        detail: result?.message || 'Password was reset.'
      });
    }
    catch(err: any) {
      this.messageService.add({ severity: 'error', summary: 'Reset Failed', detail: err.error?.message });
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
