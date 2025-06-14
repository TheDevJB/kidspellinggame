
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SpellingService, WordFamily } from '../services/spelling.service';
import { NavTabsComponent } from '../shared/nav-tabs/nav-tabs.component';

@Component({
  selector: 'app-word-family-selection',
  
  standalone: true,
  
  imports: [CommonModule, NavTabsComponent],
  
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
  
  styleUrls: ['./word-family-selection.component.css']
})

export class WordFamilySelectionComponent implements OnInit {
  
  wordFamilies: WordFamily[] = [];

  constructor(
    private spellingService: SpellingService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadWordFamilies();
  }


  loadWordFamilies(): void {
    this.spellingService.getWordFamilies().subscribe(
      families => this.wordFamilies = families
      
    );
  }

  selectFamily(family: WordFamily): void {
    this.router.navigate(['/game', family.id]);
  }
} 
