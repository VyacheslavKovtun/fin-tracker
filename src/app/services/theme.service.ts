import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly darkBackColor = '#17212f';
  private readonly lightBackColor = '#f8f9fa';
  //private readonly themeSrc = '../../assets/themes/';

  constructor(@Inject(DOCUMENT) private document: Document) { }

  get currentTheme(): 'light' | 'dark' {
    let theme = localStorage.getItem('theme');
    if(!theme)
      return 'light';
    else
      return theme.includes('light') ? 'light' : 'dark';
  }

  syncCurrentTheme() {
    let currentTheme = localStorage.getItem('theme');
    currentTheme ??= 'light-green';

    this.setTheme(currentTheme);
  }

  switchTheme() {
    let themeLink = this.document.getElementById('app-theme') as HTMLLinkElement;

    if(themeLink) {
      let currentThemeName = localStorage.getItem('theme');
      currentThemeName ??= 'light-green';

      let newTheme = currentThemeName == 'light-green' ? 'dark-green' : 'light-green';

      this.setTheme(newTheme);
    }
  }

  setTheme(theme: string) {
    let themeLink = this.document.getElementById('app-theme') as HTMLLinkElement;

    if(themeLink) {
      themeLink.href = theme + '.css';
      if(theme.includes('dark'))
        this.document.body.style.backgroundColor = this.darkBackColor;
      else
        this.document.body.style.backgroundColor = this.lightBackColor;
      
      localStorage.setItem('theme', theme);
    }
  }
}
