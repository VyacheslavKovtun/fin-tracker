import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DailyExpense } from '../models/daily-expense.model';
import { ResponseResult, ResponseResultCode } from '../models/response-result.model';
import { environment } from '../../environments/environment';
import { MessageService } from 'primeng/api';
import { Utilities } from '../shared/utilities';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private dashboardApiUrl: string;
  
    constructor(
      private http: HttpClient, 
      private messageService: MessageService,
      //private loggerService: LoggerService
      ) {
      this.dashboardApiUrl = environment.API_URL + 'dashboard';
    }

    async getFinancialSummary(userId: string, days: number = 365) {
        try {
          let result = await this.http.get<ResponseResult>
            (this.dashboardApiUrl + `/financialsummary/${userId}/${days}`,
              { headers: Utilities.getDefaultHttpHeaders() }).toPromise();
      
            if(result.code == ResponseResultCode.Failed)
            this.messageService.add({ severity: 'error', summary: 'Error', detail: result.message });
        
            if(result.code == ResponseResultCode.NothingFound)
                return null;

            return result.value;
        }
        catch (err) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
            //this.loggerService.error(err.error);

            return null;
        }
    }

    async getTopExpenseCategories(userId: string, topN: number, days: number = 30) {
        try {
          let result = await this.http.get<ResponseResult>
            (this.dashboardApiUrl + `/topexpensecategories/${userId}/${topN}/${days}`,
              { headers: Utilities.getDefaultHttpHeaders() }).toPromise();
      
            if(result.code == ResponseResultCode.Failed)
            this.messageService.add({ severity: 'error', summary: 'Error', detail: result.message });
        
            if(result.code == ResponseResultCode.NothingFound)
                return [];

            return result.values;
        }
        catch (err) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
            //this.loggerService.error(err.error);

            return [];
        }
    }

    async getMonthlyBalanceTrend(userId: string) {
        try {
          let result = await this.http.get<ResponseResult>
            (this.dashboardApiUrl + `/monthlybalancetrend/${userId}`,
              { headers: Utilities.getDefaultHttpHeaders() }).toPromise();
      
            if(result.code == ResponseResultCode.Failed)
            this.messageService.add({ severity: 'error', summary: 'Error', detail: result.message });
        
            if(result.code == ResponseResultCode.NothingFound)
                return [];

            return result.values;
        }
        catch (err) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
            //this.loggerService.error(err.error);

            return [];
        }
    }

    async getMonthlyIncomeExpenseTrend(userId: string, year: number) {
        try {
          let result = await this.http.get<ResponseResult>
            (this.dashboardApiUrl + `/monthlytrend/${userId}/${year}`,
              { headers: Utilities.getDefaultHttpHeaders() }).toPromise();
      
            if(result.code == ResponseResultCode.Failed)
            this.messageService.add({ severity: 'error', summary: 'Error', detail: result.message });
        
            if(result.code == ResponseResultCode.NothingFound)
                return [];

            return result.values;
        }
        catch (err) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
            //this.loggerService.error(err.error);

            return [];
        }
    }

    async getAverageDailyExpense(userId: string, days: number) {
        try {
          let result = await this.http.get<ResponseResult>
            (this.dashboardApiUrl + `/averagedailyexpense/${userId}/${days}`,
              { headers: Utilities.getDefaultHttpHeaders() }).toPromise();
      
            if(result.code == ResponseResultCode.Failed)
            this.messageService.add({ severity: 'error', summary: 'Error', detail: result.message });
        
            if(result.code == ResponseResultCode.NothingFound)
                return null;

            return result.value;
        }
        catch (err) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
            //this.loggerService.error(err.error);

            return null;
        }
    }

    async getDailyExpenses(userId: string, days: number = 14) {
        try {
          let result = await this.http.get<ResponseResult>
            (this.dashboardApiUrl + `/dailyexpenses/${userId}/${days}`,
              { headers: Utilities.getDefaultHttpHeaders() }).toPromise();
      
            if(result.code == ResponseResultCode.Failed)
            this.messageService.add({ severity: 'error', summary: 'Error', detail: result.message });
        
            if(result.code == ResponseResultCode.NothingFound)
                return [];

            return result.values;
        }
        catch (err) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
            //this.loggerService.error(err.error);

            return [];
        }
    }

    async getLastTransactions(userId: string, count: number, days: number = 30) {
        try {
          let result = await this.http.get<ResponseResult>
            (this.dashboardApiUrl + `/lasttransactions/${userId}/${count}/${days}`,
              { headers: Utilities.getDefaultHttpHeaders() }).toPromise();
      
            if(result.code == ResponseResultCode.Failed)
            this.messageService.add({ severity: 'error', summary: 'Error', detail: result.message });
        
            if(result.code == ResponseResultCode.NothingFound)
                return [];

            return result.values;
        }
        catch (err) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
            //this.loggerService.error(err.error);

            return [];
        }
    }
}
