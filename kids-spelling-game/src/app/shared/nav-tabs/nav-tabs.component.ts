import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-nav-tabs',
  standalone: true,
  imports: [RouterModule, CommonModule, ThemeToggleComponent],
  template: `
    <nav class="tabs">
      <a routerLink="/home" routerLinkActive="active">Home</a>
      <a class="disabled-tab" title="Coming Soon!">
        Math
        <span class="stop-icon">⛔</span>
      </a>
      <a routerLink="/families" routerLinkActive="active">Spelling</a>
      <div class="theme-toggle-wrapper">
        <app-theme-toggle></app-theme-toggle>
      </div>
    </nav>
  `,
  styles: [`
    .tabs {
      display: flex;
      gap: 2rem;
      margin-top: 2rem;
      margin-bottom: 2rem;
      width: 100%;
      justify-content: center;
      align-items: center;
      position: relative;
    }

    .theme-toggle-wrapper {
      margin-left: auto;
      position: absolute;
      right: 0;
    }

    @media (max-width: 768px) {
      .tabs {
        flex-wrap: wrap;
        gap: 1rem;
      }
      
      .theme-toggle-wrapper {
        position: static;
        margin-left: 0;
        order: -1;
        width: 100%;
        display: flex;
        justify-content: flex-end;
        margin-bottom: 1rem;
      }
    }

    .tabs a {
      text-decoration: none;
      color: var(--nav-text);
      font-size: 1.3rem;
      padding: 0.8rem 1.5rem;
      border-radius: 25px;
      transition: all 0.3s ease;
      cursor: pointer;
      position: relative;
      background: var(--nav-bg);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      font-weight: 500;
    }

    .tabs a.active {
      background: var(--nav-active);
      color: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .tabs a:not(.disabled-tab):hover {
      background: var(--nav-hover);
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .disabled-tab {
      opacity: 0.6;
      cursor: not-allowed !important;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(128, 128, 128, 0.2) !important;
      color: var(--text-light) !important;
    }

    .stop-icon {
      font-size: 1rem;
      opacity: 0;
      transition: opacity 0.3s ease;
      position: absolute;
      right: -1.5rem;
      top: 50%;
      transform: translateY(-50%);
    }

    .disabled-tab:hover .stop-icon {
      opacity: 1;
    }

    .disabled-tab:hover {
      background: rgba(255, 0, 0, 0.1) !important;
      color: var(--error-color) !important;
      transform: none !important;
    }
  `]
})
export class NavTabsComponent {} 