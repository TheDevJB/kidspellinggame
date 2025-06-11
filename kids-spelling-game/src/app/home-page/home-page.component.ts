// HOME PAGE COMPONENT
// This is the main landing page that users see when they first visit your app
// Components in Angular are like building blocks that contain HTML, CSS, and TypeScript logic

// ANGULAR IMPORTS
import { Component } from '@angular/core'; // Base class for creating Angular components
import { RouterModule, Router } from '@angular/router'; // For navigation between pages
import { CommonModule } from '@angular/common'; // Common Angular directives (ngIf, ngFor, etc.)
import { NavTabsComponent } from '../shared/nav-tabs/nav-tabs.component'; // Custom navigation component

// COMPONENT DECORATOR
// @Component tells Angular this class is a component and provides configuration
@Component({
  // COMPONENT SELECTOR
  // This is the HTML tag name where this component will be used: <app-home-page></app-home-page>
  selector: 'app-home-page',
  
  // STANDALONE COMPONENT
  // This is a modern Angular feature (17+) that doesn't require NgModule
  standalone: true,
  
  // IMPORTS
  // Other modules and components this component needs to use
  imports: [RouterModule, CommonModule, NavTabsComponent],
  
  // INLINE TEMPLATE
  // The HTML template is defined directly in this file (instead of a separate .html file)
  // This template defines what users will see on the screen
  template: `
    <!-- MAIN CONTAINER -->
    <!-- Wraps all content with consistent styling -->
    <div class="container">
      <!-- NAVIGATION TABS -->
      <!-- Custom component for navigation between different sections -->
      <app-nav-tabs></app-nav-tabs>
      
      <!-- WELCOME SECTION -->
      <!-- Eye-catching header to greet users -->
      <div class="welcome-section">
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
        <p class="subtitle">Choose your grade level and start learning!</p>
      </div>

      <!-- GRADE SELECTION SECTION -->
      <!-- Allow students to choose their grade level -->
      <div class="grade-selection" *ngIf="!selectedGrade">
        <h2>What grade are you in? 📚</h2>
        <div class="grade-grid">
          <!-- GRADE LEVEL BUTTONS -->
          <!-- Loop through available grades and create buttons -->
          <button *ngFor="let grade of grades" 
                  class="grade-button"
                  (click)="selectGrade(grade)">
            <div class="grade-icon">{{grade.icon}}</div>
            <div class="grade-name">{{grade.name}}</div>
            <div class="grade-description">{{grade.description}}</div>
          </button>
        </div>
      </div>

      <!-- LEARNING MODULES SECTION -->
      <!-- Show available learning activities for selected grade -->
      <div class="learning-modules" *ngIf="selectedGrade">
        <div class="grade-header">
          <h2>{{selectedGrade.name}} Learning Activities</h2>
          <button class="change-grade-btn" (click)="changeGrade()">Change Grade</button>
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
            Great choice! Here are the fun activities for {{selectedGrade.name}} students!
          </div>
        </div>

        <!-- ACTIVITIES GRID -->
        <!-- Main content area showing available learning activities -->
        <div class="activities-grid">
          
          <!-- COLORS ACTIVITY (Pre-K and Kindergarten) -->
          <div class="activity-card" *ngIf="selectedGrade.level === 'pre-k' || selectedGrade.level === 'kindergarten'">
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

          <!-- SPELLING ACTIVITY (All grades) -->
          <div class="activity-card">
            <div class="activity-icon">✏️</div>
            <h3>Spelling Adventure</h3>
            <p>Learn to spell words and earn stars!</p>
            <ul class="features">
              <li>🎯 Practice spelling</li>
              <li>⭐ Word families</li>
              <li>🎮 Fun animations</li>
            </ul>
            <button class="play-button" (click)="startSpellingGame()">Play Spelling!</button>
          </div>

          <!-- SENTENCES ACTIVITY (Kindergarten and up) -->
          <div class="activity-card" *ngIf="selectedGrade.level !== 'pre-k'">
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

          <!-- CAPITALIZATION ACTIVITY (Kindergarten and up) -->
          <div class="activity-card" *ngIf="selectedGrade.level !== 'pre-k'">
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

          <!-- MATH ACTIVITY (Coming Soon) -->
          <div class="activity-card coming-soon">
            <div class="activity-icon">🔢</div>
            <h3>Math Adventure</h3>
            <p>Coming Soon!</p>
            <ul class="features">
              <li>🎲 Fun with numbers</li>
              <li>🏆 Win challenges</li>
              <li>🌟 Learn math magic</li>
            </ul>
            <button class="play-button" disabled>Coming Soon</button>
          </div>
        </div>

        <!-- PROGRESS SECTION -->
        <!-- Show student's learning progress -->
        <div class="progress-section">
          <h3>Your Learning Journey 🚀</h3>
          <div class="progress-cards">
            <div class="progress-card">
              <div class="progress-icon">🎯</div>
              <p>Practice every day</p>
            </div>
            <div class="progress-card">
              <div class="progress-icon">📈</div>
              <p>Watch your progress grow</p>
            </div>
            <div class="progress-card">
              <div class="progress-icon">🏆</div>
              <p>Earn achievements</p>
            </div>
          </div>
        </div>
      </div>

      <!-- MOTIVATION SECTION -->
      <!-- Encouraging message to inspire learning -->
      <div class="motivation" *ngIf="selectedGrade">
        <p>"Every word you learn makes you smarter! Let's play and learn together! 🌈"</p>
      </div>
    </div>
  `,
  
  // EXTERNAL STYLESHEET
  // CSS styles are defined in a separate file for better organization
  styleUrl: './home-page.component.css'
})

// COMPONENT CLASS
// Contains the TypeScript logic for this component
export class HomePageComponent {
  
  // COMPONENT PROPERTIES
  // Available grade levels with their information
  grades = [
    {
      level: 'pre-k',
      name: 'Pre-K',
      icon: '🐣',
      description: 'Ages 3-4'
    },
    {
      level: 'kindergarten',
      name: 'Kindergarten',
      icon: '🌱',
      description: 'Ages 4-5'
    },
    {
      level: '1st',
      name: '1st Grade',
      icon: '🌟',
      description: 'Ages 5-6'
    },
    {
      level: '2nd',
      name: '2nd Grade',
      icon: '🚀',
      description: 'Ages 6-7'
    },
    {
      level: '3rd',
      name: '3rd Grade',
      icon: '🎯',
      description: 'Ages 7-8'
    },
    {
      level: '4th',
      name: '4th Grade',
      icon: '🏆',
      description: 'Ages 8-9'
    },
    {
      level: '5th',
      name: '5th Grade',
      icon: '👑',
      description: 'Ages 9-10'
    }
  ];

  // Currently selected grade
  selectedGrade: any = null;
  
  // DEPENDENCY INJECTION
  // Angular automatically provides a Router instance for navigation
  // 'private' makes it available throughout this component
  constructor(private router: Router) {}

  // COMPONENT METHODS
  // Functions that can be called from the template or other methods

  // SELECT GRADE METHOD
  // Called when user clicks on a grade level button
  selectGrade(grade: any): void {
    this.selectedGrade = grade;
    console.log('Selected grade:', grade);
  }

  // CHANGE GRADE METHOD
  // Allows user to go back and select a different grade
  changeGrade(): void {
    this.selectedGrade = null;
  }

  // START COLOR LEARNING METHOD
  // Navigate to color learning activities
  startColorLearning(): void {
    console.log('Starting color learning for', this.selectedGrade.level);
    this.router.navigate(['/colors', this.selectedGrade.level]);
  }

  // START SPELLING GAME METHOD
  // Called when user clicks the "Play Spelling!" button
  // Navigates to the word families selection page with grade level
  startSpellingGame(): void {
    console.log('Starting spelling game for', this.selectedGrade.level);
    this.router.navigate(['/families'], { 
      queryParams: { grade: this.selectedGrade.level } 
    });
  }

  // START SENTENCE BUILDING METHOD
  // Navigate to sentence building activities
  startSentenceBuilding(): void {
    console.log('Starting sentence building for', this.selectedGrade.level);
    this.router.navigate(['/sentences', this.selectedGrade.level]);
  }

  // START CAPITALIZATION METHOD
  // Navigate to capitalization learning
  startCapitalization(): void {
    console.log('Starting capitalization for', this.selectedGrade.level);
    this.router.navigate(['/capitalization', this.selectedGrade.level]);
  }
}
