import { Component, OnInit } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { LoaderService } from './services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  constructor(
    private themeService: ThemeService,
    protected loaderService: LoaderService,
  ) { }

  async ngOnInit() {
    this.themeService.syncCurrentTheme();
  }
}
