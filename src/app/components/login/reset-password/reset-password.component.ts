import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { LoaderService } from '../../../services/loader.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  newPassword: string;
  newPasswordConfrm: string;
  token: string;
  userId: string;

  constructor(
    private authService: AuthService,
    private loaderService: LoaderService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.token = params['token'];
      this.userId = params['userid'];
    });
  }

  async onResetPasswordClick() {
    await this.reset();
  }

  async reset() {
    this.loaderService.isGlobalLoading = true;
    
    await this.authService.resetPassword({ userId: this.userId, token: this.token, newPassword: this.newPassword });

    this.loaderService.isGlobalLoading = false;
  }
}
