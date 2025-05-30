import { Component, EventEmitter, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { LoaderService } from '../../../services/loader.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  @Output() returnToSignIn = new EventEmitter();

  email: string;

  constructor(
    private authService: AuthService,
    private loaderService: LoaderService
  ) {}

  async resetPassword() {
    this.loaderService.isGlobalLoading = true;

    await this.authService.sendPasswordReset(this.email);

    this.loaderService.isGlobalLoading = false;
  }
}
