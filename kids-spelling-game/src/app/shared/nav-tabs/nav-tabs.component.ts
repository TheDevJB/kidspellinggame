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
      color: #333;
      font-size: 1.3rem;
      padding: 0.5rem 1.5rem;
      border-radius: 20px;
      transition: background 0.3s, color 0.3s;
      cursor: pointer;
      position: relative;
    }

    .tabs a.active, .tabs a:not(.disabled-tab):hover {
      background: #43c6ac;
      color: #fff;
    }

    .disabled-tab {
      opacity: 0.7;
      cursor: not-allowed !important;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .stop-icon {
      font-size: 1rem;
      opacity: 0;
      transition: opacity 0.3s ease;
      position: absolute;
      right: -1rem;
      top: 50%;
      transform: translateY(-50%);
    }

    .disabled-tab:hover .stop-icon {
      opacity: 1;
    }

    .disabled-tab:hover {
      background: rgba(255, 0, 0, 0.1) !important;
      color: #333 !important;
    }
  `]
})
export class NavTabsComponent {} 