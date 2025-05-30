import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Injector } from '@angular/core';
import { ResponseResult, ResponseResultCode } from '../models/response-result.model';
import { Utilities } from '../shared/utilities';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { BaseApiService } from './base-api.service';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService extends BaseApiService {
  private transactionApiUrl: string;

  constructor(
    private injector: Injector
    ) {
    super(injector);
    
    this.transactionApiUrl = environment.API_URL + 'transaction';
    this.url = this.transactionApiUrl;
  }

  async getAllCurrencies() {
    return await this.getAll();
  }

  async getTransaction(id: number) {
    return await this.getById(id);
  }

  async createTransaction(transaction: Transaction) {
    return await this.create(transaction);
  }

  async updateTransaction(transaction: Transaction) {
    return await this.update(transaction);
  }

  async deleteTransaction(id: number) {
    return await this.delete(id);
  }
}