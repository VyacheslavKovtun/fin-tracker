import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Injector } from '@angular/core';
import { ResponseResult, ResponseResultCode } from '../models/response-result.model';
import { Utilities } from '../shared/utilities';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { BaseApiService } from './base-api.service';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseApiService {
  private userApiUrl: string;

  constructor(
    private injector: Injector
    ) {
    super(injector);
    
    this.userApiUrl = environment.API_URL + 'user';
    this.url = this.userApiUrl;
  }

  async getAllUsers() {
    return await this.getAll();
  }

  async getUser(id: string) {
    try {
      let responseResult = await this.http.get<ResponseResult>(this.url + `/${id}`).toPromise();
  
      if(responseResult.code == ResponseResultCode.Failed)
        this.messageService.add({ severity: 'error', summary: 'Error', detail: responseResult.message });

      return responseResult.value;
    }
    catch (err) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
      //this.loggerService.error(err.error);

      return null;
    }
  }

  async createUser(user: User) {
    return await this.create(user);
  }

  async updateUser(user: User) {
    return await this.update(user);
  }

  async deleteUser(id: string) {
    try {
      let responseResult = await this.http.delete<ResponseResult>(this.url + `/delete/${id}`).toPromise();
  
      if(responseResult.code == ResponseResultCode.Failed)
        this.messageService.add({ severity: 'error', summary: 'Error', detail: responseResult.message });

      return responseResult.code == ResponseResultCode.Success;
    }
    catch (err) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
      //this.loggerService.error(err.error);

      return false;
    }
  }
}