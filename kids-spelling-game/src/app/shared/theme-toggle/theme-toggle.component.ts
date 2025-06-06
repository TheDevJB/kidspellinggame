import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, Theme } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button class="theme-toggle" (click)="toggleTheme()" [title]="'Switch to ' + (currentTheme === 'light' ? 'dark' : 'light') + ' theme'">
      <span class="theme-icon">
        {{ currentTheme === 'light' ? '🌙' : '☀️' }}
      </span>
      <span class="theme-text">
        {{ currentTheme === 'light' ? 'Dark' : 'Light' }}
      </span>
    </button>
  `,
  styles: [`
    .theme-toggle {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: var(--theme-toggle-bg);
      border: 2px solid var(--theme-toggle-border);
      border-radius: 25px;
      color: var(--theme-toggle-text);
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.9rem;
      font-weight: 500;
      box-shadow: var(--theme-toggle-shadow);
    }

    .theme-toggle:hover {
      background: var(--theme-toggle-hover-bg);
      transform: translateY(-2px);
      box-shadow: var(--theme-toggle-hover-shadow);
    }

    .theme-icon {
      font-size: 1.2rem;
      transition: transform 0.3s ease;
    }

    .theme-toggle:hover .theme-icon {
      transform: rotate(15deg);
    }

    .theme-text {
      font-size: 0.85rem;
    }

    @media (max-width: 768px) {
      .theme-text {
        display: none;
      }
      
      .theme-toggle {
        padding: 0.5rem;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        justify-content: center;
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