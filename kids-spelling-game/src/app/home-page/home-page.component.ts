
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavTabsComponent } from '../shared/nav-tabs/nav-tabs.component';

@Component({
  selector: 'app-home-page',
  
  standalone: true,
  
  imports: [RouterModule, CommonModule, NavTabsComponent],
  
  template: `
    <!-- MAIN CONTAINER -->
    <!-- Wraps all content with consistent styling -->
    <div class="container">
      <!-- NAVIGATION TABS -->
      <!-- Custom component for navigation between different sections -->
      <app-nav-tabs></app-nav-tabs>
      
      <!-- WELCOME SECTION -->
      <!-- Eye-catching header to greet users -->
      <div class="welcome-section" *ngIf="!selectedSubject">
        <!-- DECORATIVE STARS -->
        <!-- Visual elements to make the page more engaging for kids -->
        <div class="stars">
          <div class="star"></div>
          <div class="star"></div>
          <div class="star"></div>
        </div>
        <!-- MAIN HEADING -->
        <!-- Large, friendly title with emoji to appeal to children -->
        <h1>Welcome to Learning Adventures! 🌟</h1>
        <!-- SUBTITLE -->
        <!-- Encouraging message to set a positive tone -->
        <p class="subtitle">Choose your learning adventure and start having fun!</p>
      </div>

      <!-- MAIN SUBJECT SELECTION -->
      <!-- Show main subject areas when no subject is selected -->
      <div class="subject-selection" *ngIf="!selectedSubject">
        <h2>What would you like to learn today? 📚</h2>
        <div class="subjects-grid">
          
          <!-- SPELLING ADVENTURE -->
          <div class="subject-card" (click)="selectSubject('spelling')">
            <div class="subject-icon">✏️</div>
            <h3>Spelling Adventure</h3>
            <p>Learn words, sentences, colors, and grammar!</p>
            <ul class="subject-features">
              <li>🔤 Word Families</li>
              <li>📝 Sentence Building</li>
              <li>🔠 Capitalization</li>
              <li>🎨 Color Learning</li>
            </ul>
            <div class="enter-button">Enter Adventure!</div>
          </div>

          <!-- MATH ADVENTURE -->
          <div class="subject-card coming-soon">
            <div class="subject-icon">🔢</div>
            <h3>Math Adventure</h3>
            <p>Coming Soon!</p>
            <ul class="subject-features">
              <li>🎲 Fun with Numbers</li>
              <li>🏆 Math Challenges</li>
              <li>🌟 Problem Solving</li>
              <li>📊 Counting Games</li>
            </ul>
            <div class="enter-button disabled">Coming Soon</div>
          </div>
        </div>
      </div>

      <!-- SPELLING ACTIVITIES SECTION -->
      <!-- Show spelling activities when spelling is selected -->
      <div class="activities-section" *ngIf="selectedSubject === 'spelling'">
        <div class="section-header">
          <h2>Spelling Adventure Activities 🎯</h2>
          <button class="back-button" (click)="goBackToSubjects()">← Choose Different Adventure</button>
        </div>

        <!-- MASCOT SECTION -->
        <!-- Friendly character to guide and encourage students -->
        <div class="mascot">
          <!-- CHARACTER EMOJI -->
          <!-- Visual representation of a friendly guide -->
          <div class="character">🦊</div>
          <!-- SPEECH BUBBLE -->
          <!-- Welcoming message from the mascot -->
          <div class="speech-bubble">
            Great choice! Pick any spelling activity to start learning and having fun!
          </div>
        </div>

        <!-- ACTIVITIES GRID -->
        <!-- Main content area showing available spelling activities -->
        <div class="activities-grid">
          
          <!-- WORD FAMILIES ACTIVITY -->
          <div class="activity-card">
            <div class="activity-icon">⭐</div>
            <h3>Word Families</h3>
            <p>Learn to spell words that rhyme and sound alike!</p>
            <ul class="features">
              <li>🎯 Practice spelling</li>
              <li>⭐ Word patterns</li>
              <li>🎮 Fun animations</li>
            </ul>
            <button class="play-button" (click)="startWordFamilies()">Start Word Families!</button>
          </div>

          <!-- SENTENCE BUILDING ACTIVITY -->
          <div class="activity-card">
            <div class="activity-icon">📝</div>
            <h3>Sentence Building</h3>
            <p>Build sentences and learn word order!</p>
            <ul class="features">
              <li>🔤 Word order practice</li>
              <li>📖 Fill in the blanks</li>
              <li>✨ Grammar rules</li>
            </ul>
            <button class="play-button" (click)="startSentenceBuilding()">Build Sentences!</button>
          </div>

          <!-- CAPITALIZATION ACTIVITY -->
          <div class="activity-card">
            <div class="activity-icon">🔠</div>
            <h3>Capitalization Rules</h3>
            <p>Learn when to use capital letters!</p>
            <ul class="features">
              <li>🏁 Start of sentences</li>
              <li>👤 Names and places</li>
              <li>📅 Days and months</li>
            </ul>
            <button class="play-button" (click)="startCapitalization()">Learn Capitals!</button>
          </div>
        </div>
      </div>

      <!-- COLOR LEARNING ACTIVITY -->
      <div class="activity-card">
            <div class="activity-icon">🎨</div>
            <h3>Color Learning</h3>
            <p>Learn colors, color mixing, and identification!</p>
            <ul class="features">
              <li>🌈 Identify colors</li>
              <li>🎭 Mix colors together</li>
              <li>🎯 Color challenges</li>
            </ul>
            <button class="play-button" (click)="startColorLearning()">Start Colors!</button>
          </div>

      <!-- MOTIVATION SECTION -->
      <!-- Encouraging message to inspire learning -->
      <div class="motivation" *ngIf="selectedSubject">
        <p>"Every word you learn makes you smarter! Let's play and learn together! 🌈"</p>
      </div>
    </div>
  `,
  
  styleUrl: './home-page.component.css'
})

export class HomePageComponent implements OnInit {
  
  selectedSubject: string | null = null;
  
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['subject']) {
        this.selectedSubject = params['subject'];
        console.log('Pre-selected subject from navigation:', params['subject']);
      } else {
        this.selectedSubject = null;
      }
    });
  }


  selectSubject(subject: string): void {
    this.selectedSubject = subject;
    console.log('Selected subject:', subject);
  }

  goBackToSubjects(): void {
    this.selectedSubject = null;
  }

  startWordFamilies(): void {
    console.log('Starting word families');
    this.router.navigate(['/families']);
  }

  startSentenceBuilding(): void {
    console.log('Starting sentence building');
    this.router.navigate(['/sentences', 'kindergarten']);
  }

  startColorLearning(): void {
    console.log('Starting color learning');
    this.router.navigate(['/colors', 'pre-k']);
  }

  startCapitalization(): void {
    console.log('Starting capitalization');
    this.router.navigate(['/capitalization', 'kindergarten']);
  }
}
