// THEME TOGGLE COMPONENT
// This component provides a button to switch between light and dark themes
// It subscribes to the theme service to stay in sync with the current theme

// ANGULAR IMPORTS
import { Component, OnInit } from '@angular/core'; // Component base class and lifecycle hook
import { CommonModule } from '@angular/common'; // Common Angular directives

// CUSTOM IMPORTS
import { ThemeService, Theme } from '../../services/theme.service'; // Theme service and type

// COMPONENT DECORATOR
@Component({
  // COMPONENT SELECTOR
  // Used as: <app-theme-toggle></app-theme-toggle>
  selector: 'app-theme-toggle',
  
  // STANDALONE COMPONENT
  standalone: true,
  
  // IMPORTS
  imports: [CommonModule],
  
  // INLINE TEMPLATE
  template: `
    <!-- THEME TOGGLE BUTTON -->
    <!-- (click) event binding calls toggleTheme() method -->
    <!-- [title] attribute binding creates dynamic tooltip text -->
    <button class="theme-toggle" 
            (click)="toggleTheme()" 
            [title]="'Switch to ' + (currentTheme === 'light' ? 'dark' : 'light') + ' theme'">
      
      <!-- THEME ICON -->
      <!-- Shows moon for light theme (suggesting switch to dark) -->
      <!-- Shows sun for dark theme (suggesting switch to light) -->
      <span class="theme-icon">
        {{ currentTheme === 'light' ? '🌙' : '☀️' }}
      </span>
      
      <!-- THEME TEXT -->
      <!-- Shows the theme you'll switch TO, not the current theme -->
      <span class="theme-text">
        {{ currentTheme === 'light' ? 'Dark' : 'Light' }}
      </span>
    </button>
  `,
  
  // INLINE STYLES
  styles: [`
    /* MAIN BUTTON STYLES */
    .theme-toggle {
      display: flex; /* Horizontal layout for icon and text */
      align-items: center; /* Center items vertically */
      gap: 0.5rem; /* Space between icon and text */
      padding: 0.5rem 1rem; /* Internal spacing */
      background: var(--theme-toggle-bg); /* Background from CSS variables */
      border: 2px solid var(--theme-toggle-border); /* Border color from theme */
      border-radius: 25px; /* Rounded corners */
      color: var(--theme-toggle-text); /* Text color from theme */
      cursor: pointer; /* Show pointer cursor */
      transition: all 0.3s ease; /* Smooth animations */
      font-size: 0.9rem;
      font-weight: 500; /* Medium font weight */
      box-shadow: var(--theme-toggle-shadow); /* Shadow from theme */
    }

    /* HOVER EFFECTS */
    .theme-toggle:hover {
      background: var(--theme-toggle-hover-bg); /* Hover background */
      transform: translateY(-2px); /* Lift effect */
      box-shadow: var(--theme-toggle-hover-shadow); /* Enhanced shadow */
    }

    /* ICON STYLES */
    .theme-icon {
      font-size: 1.2rem; /* Larger than text */
      transition: transform 0.3s ease; /* Smooth rotation animation */
    }

    /* ICON HOVER ANIMATION */
    .theme-toggle:hover .theme-icon {
      transform: rotate(15deg); /* Slight rotation on hover */
    }

    /* TEXT STYLES */
    .theme-text {
      font-size: 0.85rem; /* Slightly smaller than button text */
    }

    /* RESPONSIVE DESIGN - MOBILE STYLES */
    @media (max-width: 768px) {
      /* HIDE TEXT ON MOBILE */
      .theme-text {
        display: none; /* Only show icon on small screens */
      }
      
      /* CIRCULAR BUTTON ON MOBILE */
      .theme-toggle {
        padding: 0.5rem; /* Equal padding on all sides */
        border-radius: 50%; /* Make it circular */
        width: 40px; /* Fixed width */
        height: 40px; /* Fixed height */
        justify-content: center; /* Center the icon */
      }
    }
  `]
})

// COMPONENT CLASS
export class ThemeToggleComponent implements OnInit {
  
  // COMPONENT PROPERTIES
  // Stores the current theme state
  currentTheme: Theme = 'light'; // Default to light theme

  // DEPENDENCY INJECTION
  constructor(private themeService: ThemeService) {}

  // LIFECYCLE HOOK
  // Called after Angular initializes the component
  ngOnInit(): void {
    // OBSERVABLE SUBSCRIPTION
    // Subscribe to theme changes from the service
    // This keeps the component in sync with the global theme state
    this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme; // Update local state when theme changes
    });
  }

  // COMPONENT METHODS

  // TOGGLE THEME METHOD
  // Called when user clicks the theme toggle button
  toggleTheme(): void {
    // Delegate to the theme service to handle the actual theme switching
    // The service will update the theme and notify all subscribers
    this.themeService.toggleTheme();
  }
} 