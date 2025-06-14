
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThemeService, Theme } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  
  standalone: true,
  
  imports: [CommonModule],
  
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
  
  styles: [`
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

    .theme-toggle:hover {
      background: var(--theme-toggle-hover-bg); /* Hover background */
      transform: translateY(-2px); /* Lift effect */
      box-shadow: var(--theme-toggle-hover-shadow); /* Enhanced shadow */
    }

    .theme-icon {
      font-size: 1.2rem; /* Larger than text */
      transition: transform 0.3s ease; /* Smooth rotation animation */
    }

    .theme-toggle:hover .theme-icon {
      transform: rotate(15deg); /* Slight rotation on hover */
    }

    .theme-text {
      font-size: 0.85rem; /* Slightly smaller than button text */
    }

    @media (max-width: 768px) {
      .theme-text {
        display: none; /* Only show icon on small screens */
      }
      
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

export class ThemeToggleComponent implements OnInit {
  
  currentTheme: Theme = 'light';

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }


  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
} 
