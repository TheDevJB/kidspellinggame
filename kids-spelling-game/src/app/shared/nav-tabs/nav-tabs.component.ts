// NAVIGATION TABS COMPONENT
// This is a reusable navigation component that appears at the top of pages
// It provides links to different sections of the app and includes a theme toggle

// ANGULAR IMPORTS
import { Component } from '@angular/core'; // Base component class
import { RouterModule } from '@angular/router'; // For navigation links and active route detection
import { CommonModule } from '@angular/common'; // Common Angular directives

// CUSTOM IMPORTS
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component'; // Theme switcher component

// COMPONENT DECORATOR
@Component({
  // COMPONENT SELECTOR
  // Used as: <app-nav-tabs></app-nav-tabs>
  selector: 'app-nav-tabs',
  
  // STANDALONE COMPONENT
  standalone: true,
  
  // IMPORTS
  // RouterModule needed for routerLink and routerLinkActive directives
  imports: [RouterModule, CommonModule, ThemeToggleComponent],
  
  // INLINE TEMPLATE
  template: `
    <!-- NAVIGATION CONTAINER -->
    <nav class="tabs">
      <!-- HOME LINK -->
      <!-- routerLink="/home" creates a link to the home page -->
      <!-- routerLinkActive="active" adds 'active' class when this route is current -->
      <a routerLink="/home" routerLinkActive="active">Home</a>
      
      <!-- DISABLED MATH TAB -->
      <!-- This tab is disabled since math features aren't implemented yet -->
      <!-- title attribute shows tooltip on hover -->
      <a class="disabled-tab" title="Coming Soon!">
        Math
        <!-- STOP ICON -->
        <!-- Visual indicator that this feature is not available -->
        <span class="stop-icon">⛔</span>
      </a>
      
      <!-- SPELLING LINK -->
      <!-- Links to the word family selection page -->
      <a routerLink="/families" routerLinkActive="active">Spelling</a>
      
      <!-- THEME TOGGLE WRAPPER -->
      <!-- Container for the theme switcher component -->
      <div class="theme-toggle-wrapper">
        <app-theme-toggle></app-theme-toggle>
      </div>
    </nav>
  `,
  
  // INLINE STYLES
  // CSS styles defined directly in the component
  styles: [`
    /* MAIN NAVIGATION CONTAINER */
    .tabs {
      display: flex; /* Horizontal layout */
      gap: 2rem; /* Space between navigation items */
      margin-top: 2rem;
      margin-bottom: 2rem;
      width: 100%;
      justify-content: center; /* Center the navigation items */
      align-items: center; /* Vertically align items */
      position: relative; /* For absolute positioning of theme toggle */
    }

    /* THEME TOGGLE POSITIONING */
    .theme-toggle-wrapper {
      margin-left: auto; /* Push to the right */
      position: absolute; /* Position relative to .tabs container */
      right: 0; /* Align to right edge */
    }

    /* RESPONSIVE DESIGN - MOBILE STYLES */
    @media (max-width: 768px) {
      .tabs {
        flex-wrap: wrap; /* Allow items to wrap to new line */
        gap: 1rem; /* Smaller gap on mobile */
      }
      
      /* MOBILE THEME TOGGLE POSITIONING */
      .theme-toggle-wrapper {
        position: static; /* Remove absolute positioning */
        margin-left: 0;
        order: -1; /* Move to beginning of flex container */
        width: 100%;
        display: flex;
        justify-content: flex-end; /* Align to right */
        margin-bottom: 1rem; /* Space below theme toggle */
      }
    }

    /* NAVIGATION LINK STYLES */
    .tabs a {
      text-decoration: none; /* Remove underline */
      color: var(--nav-text); /* CSS custom property for theming */
      font-size: 1.3rem;
      padding: 0.8rem 1.5rem; /* Internal spacing */
      border-radius: 25px; /* Rounded corners */
      transition: all 0.3s ease; /* Smooth animations */
      cursor: pointer;
      position: relative; /* For absolute positioned elements inside */
      background: var(--nav-bg); /* Background color from theme */
      backdrop-filter: blur(10px); /* Glass effect */
      border: 1px solid rgba(255, 255, 255, 0.1); /* Subtle border */
      font-weight: 500; /* Medium font weight */
    }

    /* ACTIVE LINK STYLES */
    /* Applied when routerLinkActive="active" matches current route */
    .tabs a.active {
      background: var(--nav-active); /* Active background color */
      color: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); /* Drop shadow */
    }

    /* HOVER EFFECTS */
    /* :not(.disabled-tab) excludes disabled tabs from hover effects */
    .tabs a:not(.disabled-tab):hover {
      background: var(--nav-hover); /* Hover background color */
      color: white;
      transform: translateY(-2px); /* Lift effect */
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); /* Enhanced shadow */
    }

    /* DISABLED TAB STYLES */
    .disabled-tab {
      opacity: 0.6; /* Semi-transparent */
      cursor: not-allowed !important; /* Show "not allowed" cursor */
      display: flex; /* For icon alignment */
      align-items: center; /* Center icon vertically */
      gap: 0.5rem; /* Space between text and icon */
      background: rgba(128, 128, 128, 0.2) !important; /* Gray background */
      color: var(--text-light) !important; /* Light text color */
    }

    /* STOP ICON STYLES */
    .stop-icon {
      font-size: 1rem;
      opacity: 0; /* Hidden by default */
      transition: opacity 0.3s ease; /* Fade in/out animation */
      position: absolute; /* Position relative to parent */
      right: -1.5rem; /* Position outside the tab */
      top: 50%;
      transform: translateY(-50%); /* Center vertically */
    }

    /* SHOW STOP ICON ON HOVER */
    .disabled-tab:hover .stop-icon {
      opacity: 1; /* Make visible */
    }

    /* DISABLED TAB HOVER EFFECTS */
    .disabled-tab:hover {
      background: rgba(255, 0, 0, 0.1) !important; /* Red tint */
      color: var(--error-color) !important; /* Error color */
      transform: none !important; /* No lift effect */
    }
  `]
})

// COMPONENT CLASS
// This component doesn't need any TypeScript logic, so it's empty
// All functionality is handled by the template and styles
export class NavTabsComponent {} 