import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'dark';

@Injectable({
  providedIn: 'root'
})

export class ThemeService {
  private currentTheme = new BehaviorSubject<Theme>('dark');
  
  public theme$ = this.currentTheme.asObservable();
  
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    if (this.isBrowser) {
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme) {
        this.setTheme(savedTheme);
      }
    }
  }

  getCurrentTheme(): Theme {
    return this.currentTheme.value;
  }
} 
