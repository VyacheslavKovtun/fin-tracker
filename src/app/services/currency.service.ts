import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Injector } from '@angular/core';
import { ResponseResult, ResponseResultCode } from '../models/response-result.model';
import { Utilities } from '../shared/utilities';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { BaseApiService } from './base-api.service';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { Currency } from '../models/currency.model';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService extends BaseApiService {
  private currencyApiUrl: string;

  constructor(
    private injector: Injector
    ) {
    super(injector);
    
    this.currencyApiUrl = environment.API_URL + 'currency';
    this.url = this.currencyApiUrl;
  }

  async getAllCurrencies() {
    return await this.getAll();
  }

  async getCurrency(id: number) {
    return await this.getById(id);
  }

  async createCurrency(currency: Currency) {
    return await this.create(currency);
  }

  async updateCurrency(currency: Currency) {
    return await this.update(currency);
  }

  async deleteCurrency(id: number) {
    return await this.delete(id);
  }
}