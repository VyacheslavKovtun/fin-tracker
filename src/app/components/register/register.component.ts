import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { LoaderService } from '../../services/loader.service';

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
