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

  async getTransaction(id: string) {
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

  async createTransaction(transaction: Transaction) {
    return await this.create(transaction);
  }

  async updateTransaction(transaction: Transaction) {
    return await this.update(transaction);
  }

  async deleteTransaction(id: string) {
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