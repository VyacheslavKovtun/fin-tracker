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
  items: MenuItem[] = [
    {
      label: 'Profile',
      items: [
        {
          label: 'Settings',
          icon: 'pi pi-cog',
          routerLink: '/settings'
        },
        {
          label: 'Logout',
          icon: 'pi pi-sign-out',
          command: () => {
            this.logout();
          }
        }
      ]
    }
  ];

  constructor(
    protected themeService: ThemeService,
    protected authService: AuthService
  ) {
  }

  async ngOnInit() {
    
  }

  changeTheme() {
    this.themeService.switchTheme();
  }

  logout() {
    this.authService.logout();
    //this.sidebarRef.close(event);
  }

  ngOnDestroy(): void {
  }
}
