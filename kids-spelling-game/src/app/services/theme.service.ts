// ANGULAR IMPORTS
import { Injectable, Inject, PLATFORM_ID } from '@angular/core'; // Injectable decorator and platform detection
import { isPlatformBrowser } from '@angular/common'; // Helper to check if code is running in browser
import { BehaviorSubject } from 'rxjs'; // RxJS observable for reactive programming

// TYPE DEFINITION
// Define a custom type for theme values - this provides type safety
export type Theme = 'light' | 'dark';

// SERVICE DECORATOR
// @Injectable tells Angular this class can be injected as a dependency
// providedIn: 'root' means this service is available app-wide (singleton)
@Injectable({
  providedIn: 'root'
})

// SERVICE CLASS
// Services contain business logic and data that can be shared across components
export class ThemeService {
  // PRIVATE PROPERTIES
  // BehaviorSubject is like a variable that components can "subscribe" to for updates
  // It holds the current value and emits new values when they change
  private currentTheme = new BehaviorSubject<Theme>('light');
  
  // PUBLIC OBSERVABLE
  // Components can subscribe to this to get notified when theme changes
  // asObservable() prevents external code from calling .next() directly
  public theme$ = this.currentTheme.asObservable();
  
  // PLATFORM DETECTION
  // We need to know if we're running in a browser (not server-side rendering)
  private isBrowser: boolean;

  // DEPENDENCY INJECTION IN CONSTRUCTOR
  // @Inject(PLATFORM_ID) injects Angular's platform identifier
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Check if we're running in a browser environment
    // This is important for server-side rendering (SSR) compatibility
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    // INITIALIZATION LOGIC
    // Only access localStorage if we're in a browser (localStorage doesn't exist on server)
    if (this.isBrowser) {
      // Load saved theme from localStorage or default to light
      // localStorage.getItem() returns string | null, so we cast it to our Theme type
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme) {
        // If user has a saved preference, use it
        this.setTheme(savedTheme);
      } else {
        // If no saved preference, default to light theme
        this.setTheme('light');
      }
    }
  }

  // PUBLIC METHODS
  // These methods can be called by components that inject this service

  // Set the current theme and persist it
  setTheme(theme: Theme): void {
    // Update the BehaviorSubject - this notifies all subscribers
    this.currentTheme.next(theme);
    
    // Only interact with browser APIs if we're in a browser
    if (this.isBrowser) {
      // Save theme preference to localStorage for persistence across sessions
      localStorage.setItem('theme', theme);
      
      // Set CSS custom property on the root HTML element
      // This allows CSS to react to theme changes using [data-theme="dark"] selectors
      document.documentElement.setAttribute('data-theme', theme);
    }
  }

  // Toggle between light and dark themes
  toggleTheme(): void {
    // Use ternary operator to switch between themes
    // If current is 'light', switch to 'dark', otherwise switch to 'light'
    const newTheme = this.currentTheme.value === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  // Get the current theme value (synchronous)
  getCurrentTheme(): Theme {
    // BehaviorSubject.value gives us the current value without subscribing
    return this.currentTheme.value;
  }
} 