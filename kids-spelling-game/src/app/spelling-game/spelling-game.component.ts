
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';

import { SpellingService, WordFamily, SpellingWord } from '../services/spelling.service';
import { NavTabsComponent } from '../shared/nav-tabs/nav-tabs.component';

@Component({
  selector: 'app-spelling-game',
  
  standalone: true,
  
  imports: [CommonModule, FormsModule, NavTabsComponent],
  
  templateUrl: './spelling-game.component.html',
  
  styleUrls: ['./spelling-game.component.css']
})

export class SpellingGameComponent implements OnInit, OnDestroy {
  
  
  wordFamilies: WordFamily[] = [];
  selectedFamily: WordFamily | null = null;
  currentWord: SpellingWord | null = null;
  reviewSentences: string[] = [];
  
  userInput: string = '';
  message: string = '';
  score: number = 0;
  wordsLearned: number = 0;
  
  isWordVisible: boolean = true;
  isWordFading: boolean = false;
  isSuccess: boolean = false;
  isError: boolean = false;
  showingReview: boolean = false;
  
  private fadeTimeout: any;
  private animationTimeout: any;
  private familyId: number | null = null;
  private wordDisplayTimer: Subscription | null = null;

  constructor(
    private spellingService: SpellingService,
    private route: ActivatedRoute,
    private router: Router
  ) {}


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.familyId = +params['familyId'];
      if (this.familyId) {
        this.loadSelectedFamily();
      }
    });
    
    this.loadWordFamilies();
  }

  ngOnDestroy(): void {
    if (this.fadeTimeout) {
      clearTimeout(this.fadeTimeout);
    }
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }
    if (this.wordDisplayTimer) {
      this.wordDisplayTimer.unsubscribe();
    }
  }


  loadWordFamilies() {
    this.spellingService.getWordFamilies().subscribe(families => {
      this.wordFamilies = families;
    });
  }

  loadSelectedFamily() {
    if (this.familyId) {
      this.spellingService.getWordFamily(this.familyId).subscribe(family => {
        if (family) {
          this.selectedFamily = family;
          this.wordsLearned = family.wordsLearned;
          this.loadNewWord();
        }
      });
    }
  }

  selectFamily(family: WordFamily) {
    this.selectedFamily = family;
    this.score = 0;
    this.wordsLearned = family.wordsLearned;
    this.showingReview = false;
    this.loadNewWord();
  }


  loadNewWord(): void {
    if (this.familyId) {
      this.spellingService.getRandomWord(this.familyId).subscribe(word => {
        this.currentWord = word;
        this.userInput = '';
        this.message = '';
        this.isSuccess = false;
        this.isError = false;
        this.startWordDisplay();
      });
    }
  }

  startWordDisplay(): void {
    this.isWordVisible = true;
    this.isWordFading = false;

    if (this.wordDisplayTimer) {
      this.wordDisplayTimer.unsubscribe();
    }

    this.wordDisplayTimer = timer(4000).subscribe(() => {
      this.isWordFading = true;
      
      setTimeout(() => {
        this.isWordVisible = false;
        this.isWordFading = false;
      }, 400);
    });
  }

  showWordAgain(): void {
    this.startWordDisplay();
  }


  checkSpelling(): void {
    if (!this.currentWord || this.isWordVisible || !this.userInput.trim()) return;

    this.spellingService.checkSpelling(this.currentWord.id, this.userInput).subscribe(result => {
      if (result.correct) {
        this.handleCorrectAnswer();
      } else {
        this.handleIncorrectAnswer();
      }
    });
  }

  handleCorrectAnswer() {
    this.isSuccess = true;
    this.isError = false;
    this.score += 10;
    this.message = 'Correct! Well done! 🌟';

    if (this.selectedFamily) {
      this.wordsLearned = this.selectedFamily.wordsLearned;
    }

    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }

    if (this.selectedFamily && this.wordsLearned >= this.selectedFamily.words.length) {
      this.completeFamily();
    } else {
      this.animationTimeout = setTimeout(() => {
        this.loadNewWord();
      }, 2000);
    }
  }

  handleIncorrectAnswer() {
    this.isSuccess = false;
    this.isError = true;
    this.message = 'Keep trying! You can do it! 💪';

    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }
    
    this.animationTimeout = setTimeout(() => {
      this.isError = false;
      this.message = '';
    }, 2000);
  }


  completeFamily() {
    if (!this.selectedFamily) return;

    this.spellingService.markFamilyCompleted(this.selectedFamily.id).subscribe(() => {
      this.spellingService.getReviewSentences(this.selectedFamily!.id).subscribe(sentences => {
        this.reviewSentences = sentences;
        this.showingReview = true;
      });
    });
  }

  practiceWord(index: number) {
    if (!this.selectedFamily) return;
    
    this.showingReview = false;
    
    this.currentWord = this.selectedFamily.words[index];
    
    this.userInput = '';
    this.message = '';
    this.isSuccess = false;
    this.isError = false;
    
    this.startWordDisplay();
  }


  startNewFamily() {
    this.selectedFamily = null;
    this.showingReview = false;
    this.score = 0;
    this.wordsLearned = 0;
    
    this.router.navigate(['/families']);
  }

  restartFamily() {
    if (!this.selectedFamily) return;
    
    this.showingReview = false;
    this.score = 0;
    this.wordsLearned = 0;
    
    this.loadNewWord();
  }

  goBackToFamilies(): void {
    this.router.navigate(['/families']);
  }
}
