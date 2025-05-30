import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { LoaderService } from '../../services/loader.service';
import { ResponseResultCode } from '../../models/response-result.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  name: string;
  email: string;
  password: string;

  constructor(
    private authService: AuthService,
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
    })
  }

  async onRegisterClick() {
    await this.register();
  }

  async register() {
    this.loaderService.isGlobalLoading = true;
    
    await this.authService.register({ name: this.name, email: this.email, password: this.password, preferredCurrencyCode: 'UAH' });

    this.loaderService.isGlobalLoading = false;
  }
}
