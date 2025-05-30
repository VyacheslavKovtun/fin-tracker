import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../services/loader.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string;
  password: string;
  remember = false;

  forgotPassword = false;

  constructor(
    private authService: AuthService,
    private loaderService: LoaderService
  ) { }

  async ngOnInit() {
  }

  async onLoginClick() {
    await this.login();
  }

  async login() {
    this.loaderService.isGlobalLoading = true;
    
    await this.authService.login({ email: this.email, password: this.password }, this.remember);

    this.loaderService.isGlobalLoading = false;
  }
}
