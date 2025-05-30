import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Injector } from '@angular/core';
import { ResponseResult, ResponseResultCode } from '../models/response-result.model';
import { Utilities } from '../shared/utilities';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { BaseApiService } from './base-api.service';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseApiService {
  private categoryApiUrl: string;

  constructor(
    private injector: Injector
    ) {
    super(injector);
    
    this.categoryApiUrl = environment.API_URL + 'category';
    this.url = this.categoryApiUrl;
  }

  async getAllCurrencies() {
    return await this.getAll();
  }

  async getCategory(id: number) {
    return await this.getById(id);
  }

  async createCategory(category: Category) {
    return await this.create(category);
  }

  async updateCategory(category: Category) {
    return await this.update(category);
  }

  async deleteCategory(id: number) {
    return await this.delete(id);
  }
}