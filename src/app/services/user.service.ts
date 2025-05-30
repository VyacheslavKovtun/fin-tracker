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

  async getAllCurrencies() {
    return await this.getAll();
  }

  async getUser(id: number) {
    return await this.getById(id);
  }

  async createUser(user: User) {
    return await this.create(user);
  }

  async updateUser(user: User) {
    return await this.update(user);
  }

  async deleteUser(id: number) {
    return await this.delete(id);
  }
}