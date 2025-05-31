import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Injector } from '@angular/core';
import { ResponseResult, ResponseResultCode } from '../models/response-result.model';
import { Utilities } from '../shared/utilities';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseApiService {
  protected http: HttpClient;
  protected messageService: MessageService;
  //protected loggerService: LoggerService;

  protected url: string;

  constructor(injector: Injector) { 
    this.http = injector.get(HttpClient);
    this.messageService = injector.get(MessageService);
    //this.loggerService = injector.get(LoggerService);
  }

  protected async getAll() {
    try {
      let responseResult = await this.http.get<ResponseResult>(this.url).toPromise();

      if(responseResult.code == ResponseResultCode.Failed)
        this.messageService.add({ severity: 'error', summary: 'Error', detail: responseResult.message });
      
      if(responseResult.code == ResponseResultCode.NothingFound)
        return [];

      return responseResult.values;
    }
    catch (err) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
      //this.loggerService.error(err.error);

      return [];
    }
  }

  protected async getById(id: number) {
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

  protected async create(item: any) {
    try {
      let body = JSON.stringify(item);
  
      let responseResult = await this.http.post<ResponseResult>(this.url + '/create', body, {
        headers: Utilities.getDefaultHttpHeaders()
      }).toPromise();
  
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

  protected async update(item: any) {
    try {
      let body = JSON.stringify(item);
  
      let responseResult = await this.http.put<ResponseResult>(this.url + '/update', body, {
        headers: Utilities.getDefaultHttpHeaders()
      }).toPromise();
  
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

  protected async delete(id: number) {
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
