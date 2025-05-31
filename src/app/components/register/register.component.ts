import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { LoaderService } from '../../services/loader.service';
import { ResponseResultCode } from '../../models/response-result.model';
import { Currency } from '../../models/currency.model';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  name: string;
  email: string;
  password: string;

  currencies: Currency[] = [];
  selectedCurrency: string = 'UAH';

  constructor(
    private authService: AuthService,
    private currencyService: CurrencyService,
    private loaderService: LoaderService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute
  ) { }

  async ngOnInit() {
    this.activatedRoute.queryParams.subscribe(async(p) => {
      let userId = p['userid'];
      let emailToken = p['token'];
      if(userId && emailToken)
        await this.authService.confirmEmail(userId, emailToken);
    });

    this.currencies = await this.currencyService.getAllCurrencies();
  }

  async onRegisterClick() {
    await this.register();
  }

  async register() {
    this.loaderService.isGlobalLoading = true;
    
    await this.authService.register({ name: this.name, email: this.email, password: this.password, preferredCurrencyCode: this.selectedCurrency });

    this.loaderService.isGlobalLoading = false;
  }
}
