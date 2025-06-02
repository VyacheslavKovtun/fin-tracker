import { Component } from '@angular/core';
import { Currency } from '../../models/currency.model';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { CurrencyService } from '../../services/currency.service';
import { LoaderService } from '../../services/loader.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  currentUser: User;

  currencies: Currency[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private currencyService: CurrencyService,
    private loaderService: LoaderService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute
  ) { }

  async ngOnInit() {
    this.currentUser = await this.userService.getUser(this.authService.currentUserId);
    this.currencies = await this.currencyService.getAllCurrencies();
  }

  async onSaveClick() {
    await this.save();
  }

  async save() {
    this.loaderService.isGlobalLoading = true;
    
    let res = await this.userService.updateUser(this.currentUser);
    if(res)
      this.messageService.add({ severity: 'success', summary: 'Updated successfully!', detail: 'User information was saved' });

    this.loaderService.isGlobalLoading = false;
  }
}
