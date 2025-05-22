import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { Sidebar } from 'primeng/sidebar';
import { Router } from '@angular/router';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {

  subscription = new Subscription();

  @ViewChild('sidebarRef') sidebarRef: Sidebar;

  sidebarVisible: boolean = false;

  constructor(
    protected themeService: ThemeService,
    protected authService: AuthService,

    private router: Router,

    private loaderService: LoaderService,
  ) {
  }

  async ngOnInit() {
    
  }

  onMenuItemClick(routerLink: string) {
    this.router.navigate([routerLink]);
  }

  closeCallback(e): void {
    this.sidebarRef.close(e);
  }

  reloadPage() {
    window.location.reload()
  }

  changeTheme() {
    this.themeService.switchTheme();
  }

  logout(event) {
    this.authService.logout();
    this.sidebarRef.close(event);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
