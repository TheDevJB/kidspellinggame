import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Always use dark theme - no switching needed
  getCurrentTheme(): string {
    return 'dark';
  }
}
