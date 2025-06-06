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
    <div class="container">
      <app-nav-tabs></app-nav-tabs>
      <div class="word-family-grid">
        <div *ngFor="let family of wordFamilies" 
             [ngClass]="{'word-family-card': true, 'completed': family.completed, 'in-progress': family.inProgress && !family.completed}"
             (click)="selectFamily(family)">
          <span class="difficulty" [ngClass]="family.difficulty.toLowerCase()">
            {{family.difficulty}}
          </span>
          <span class="status-badge" *ngIf="family.completed || family.inProgress">
            {{family.completed ? 'Completed!' : 'In Progress'}}
          </span>
          <h3>{{family.name}}</h3>
          <p>{{family.description}}</p>
          <div class="progress-bar" *ngIf="family.inProgress && !family.completed">
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