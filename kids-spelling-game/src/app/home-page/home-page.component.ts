import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavTabsComponent } from '../shared/nav-tabs/nav-tabs.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterModule, CommonModule, NavTabsComponent],
  template: `
    <div class="container">
      <app-nav-tabs></app-nav-tabs>
      
      <div class="welcome-section">
        <div class="stars">
          <div class="star"></div>
          <div class="star"></div>
          <div class="star"></div>
        </div>
        <h1>Welcome to Learning Adventures! 🌟</h1>
        <p class="subtitle">Where learning is super fun!</p>
      </div>

      <div class="mascot">
        <div class="character">🦊</div>
        <div class="speech-bubble">
          Hi friend! Ready to learn and have fun? Choose your adventure below!
        </div>
      </div>

      <div class="games-grid">
        <div class="game-card">
          <div class="game-icon">✏️</div>
          <h2>Spelling Adventure</h2>
          <p>Learn to spell words and earn stars!</p>
          <ul class="features">
            <li>🎯 Practice spelling</li>
            <li>⭐ Earn points</li>
            <li>🎮 Fun animations</li>
          </ul>
          <button class="play-button" (click)="startSpellingGame()">Play Now!</button>
        </div>

        <div class="game-card coming-soon">
          <div class="game-icon">🔢</div>
          <h2>Math Adventure</h2>
          <p>Coming Soon!</p>
          <ul class="features">
            <li>🎲 Fun with numbers</li>
            <li>🏆 Win challenges</li>
            <li>🌟 Learn math magic</li>
          </ul>
          <button class="play-button" disabled>Coming Soon</button>
        </div>
      </div>

      <div class="achievements">
        <h2>Your Learning Journey 🚀</h2>
        <div class="achievement-cards">
          <div class="achievement">
            <div class="achievement-icon">🎯</div>
            <p>Practice every day</p>
          </div>
          <div class="achievement">
            <div class="achievement-icon">📈</div>
            <p>Watch your progress grow</p>
          </div>
          <div class="achievement">
            <div class="achievement-icon">🏆</div>
            <p>Earn achievements</p>
          </div>
        </div>
      </div>

      <div class="motivation">
        <p>"Every word you learn makes you smarter! Let's play and learn together! 🌈"</p>
      </div>
    </div>
  `,
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  constructor(private router: Router) {}

  startSpellingGame(): void {
    console.log('Starting spelling game...');
    this.router.navigate(['/families']).then(() => {
      console.log('Navigation completed');
    }).catch(error => {
      console.error('Navigation error:', error);
    });
  }
}
