import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  isGlobalLoading: boolean = false;

  constructor() { }
}
