// WORD FAMILY SELECTION COMPONENT
// This component displays all available word families (like AT, AN, ING)
// Students can choose which word family they want to practice

// ANGULAR IMPORTS
import { Component, OnInit } from '@angular/core'; // Component base class and lifecycle hook
import { Router } from '@angular/router'; // For navigation to the spelling game
import { CommonModule } from '@angular/common'; // Common Angular directives (ngFor, ngIf, ngClass)

// CUSTOM IMPORTS
import { SpellingService, WordFamily } from '../services/spelling.service'; // Service and interface for spelling data
import { NavTabsComponent } from '../shared/nav-tabs/nav-tabs.component'; // Navigation component

// COMPONENT DECORATOR
@Component({
  // COMPONENT SELECTOR
  // HTML tag name: <app-word-family-selection></app-word-family-selection>
  selector: 'app-word-family-selection',
  
  // STANDALONE COMPONENT
  // Modern Angular 17+ feature - no NgModule required
  standalone: true,
  
  // IMPORTS
  // Modules and components this component uses
  imports: [CommonModule, NavTabsComponent],
  
  // INLINE TEMPLATE
  // HTML template defined directly in the TypeScript file
  template: `
    <!-- MAIN CONTAINER -->
    <div class="container">
      <!-- NAVIGATION TABS -->
      <app-nav-tabs></app-nav-tabs>
      
      <!-- WORD FAMILY GRID -->
      <!-- Container for all word family cards -->
      <div class="word-family-grid">
        <!-- WORD FAMILY CARD LOOP -->
        <!-- *ngFor is Angular directive that repeats this div for each word family -->
        <!-- 'let family of wordFamilies' creates a local variable 'family' for each iteration -->
        <div *ngFor="let family of wordFamilies" 
             [ngClass]="{'word-family-card': true, 'completed': family.completed, 'in-progress': family.inProgress && !family.completed}"
             (click)="selectFamily(family)">
          
          <!-- DIFFICULTY BADGE -->
          <!-- Shows if the family is easy, medium, or hard -->
          <!-- [ngClass] dynamically adds CSS classes based on the difficulty level -->
          <span class="difficulty" [ngClass]="family.difficulty.toLowerCase()">
            {{family.difficulty}}
          </span>
          
          <!-- STATUS BADGE -->
          <!-- Only shows if family is completed or in progress -->
          <!-- *ngIf conditionally displays this element -->
          <span class="status-badge" *ngIf="family.completed || family.inProgress">
            <!-- TERNARY OPERATOR -->
            <!-- Shows "Completed!" if family.completed is true, otherwise "In Progress" -->
            {{family.completed ? 'Completed!' : 'In Progress'}}
          </span>
          
          <!-- FAMILY NAME -->
          <!-- {{}} is Angular interpolation - displays the value of family.name -->
          <h3>{{family.name}}</h3>
          
          <!-- FAMILY DESCRIPTION -->
          <p>{{family.description}}</p>
          
          <!-- PROGRESS BAR -->
          <!-- Only shows for families that are in progress but not completed -->
          <div class="progress-bar" *ngIf="family.inProgress && !family.completed">
            <!-- DYNAMIC STYLING -->
            <!-- [style.width.%] dynamically sets the width based on progress -->
            <!-- Calculates percentage: (words learned / total words) * 100 -->
            <div class="progress-bar-fill" [style.width.%]="(family.wordsLearned / family.words.length) * 100"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  
  // EXTERNAL STYLESHEET
  // CSS styles are in a separate file
  styleUrls: ['./word-family-selection.component.css']
})

// COMPONENT CLASS
// Implements OnInit interface, which requires ngOnInit() method
export class WordFamilySelectionComponent implements OnInit {
  
  // COMPONENT PROPERTIES
  // Array to store all word families loaded from the service
  wordFamilies: WordFamily[] = [];

  // DEPENDENCY INJECTION
  // Angular automatically provides instances of these services
  constructor(
    private spellingService: SpellingService, // Service for spelling-related data and operations
    private router: Router // Service for navigation between routes
  ) { }

  // LIFECYCLE HOOK
  // ngOnInit() is called after Angular initializes the component
  // This is where you typically load initial data
  ngOnInit(): void {
    // Load word families when component initializes
    this.loadWordFamilies();
  }

  // COMPONENT METHODS

  // LOAD WORD FAMILIES METHOD
  // Fetches word families from the spelling service
  loadWordFamilies(): void {
    // OBSERVABLE SUBSCRIPTION
    // spellingService.getWordFamilies() returns an Observable
    // .subscribe() tells Angular what to do when data arrives
    this.spellingService.getWordFamilies().subscribe(
      // SUCCESS CALLBACK
      // This function runs when data is successfully received
      // 'families' parameter contains the word families data
      families => this.wordFamilies = families
      
      // NOTE: In production, you'd also handle errors:
      // families => this.wordFamilies = families,
      // error => console.error('Error loading families:', error)
    );
  }

  // SELECT FAMILY METHOD
  // Called when user clicks on a word family card
  // Navigates to the spelling game for the selected family
  selectFamily(family: WordFamily): void {
    // ROUTER NAVIGATION
    // Navigate to '/game/:familyId' route
    // family.id becomes the route parameter
    // Example: if family.id is 1, navigates to '/game/1'
    this.router.navigate(['/game', family.id]);
  }
} 