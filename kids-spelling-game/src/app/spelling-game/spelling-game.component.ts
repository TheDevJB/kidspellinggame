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
  highlightedSentences: { text: string; highlighted: boolean }[][] = [];
  
  userInput: string = '';
  message: string = '';
  score: number = 0;
  wordsLearned: number = 0;
  
  isWordVisible: boolean = true;
  isWordFading: boolean = false;
  isSuccess: boolean = false;
  isError: boolean = false;
  showingReview: boolean = false;
  isProcessing: boolean = false;
  
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
          this.wordsLearned = 0;
          this.loadNewWord();
        }
      });
    }
  }

  selectFamily(family: WordFamily) {
    this.selectedFamily = family;
    this.familyId = family.id;
    this.score = 0;
    this.wordsLearned = 0;
    this.showingReview = false;
    this.loadNewWord();
  }


  loadNewWord(): void {
    const familyId = this.familyId || this.selectedFamily?.id;
    
    if (familyId) {
      this.spellingService.getRandomWord(familyId).subscribe({
        next: (word) => {
          this.currentWord = word;
          this.userInput = '';
          this.message = '';
          this.isSuccess = false;
          this.isError = false;
          this.startWordDisplay();
        },
        error: (error) => {
          console.error('Error loading word:', error);
          this.message = 'Error loading word. Please try again.';
        }
      });
    } else {
      console.error('No family selected');
      this.message = 'Please select a word family first.';
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
    // attempting to prevent spamming
    if (!this.currentWord || this.isWordVisible || !this.userInput.trim() || this.isProcessing) {
      return;
    }
//TODO: Figure out how to prevent spamming
    this.isProcessing = true;

    this.spellingService.checkSpelling(this.currentWord.id, this.userInput).subscribe({
      next: (result) => {
        if (result && result.correct) {
          this.handleCorrectAnswer();
        } else {
          this.handleIncorrectAnswer();
        }
      },
      error: (error) => {
        console.error('Error checking spelling:', error);
        this.message = 'Error checking spelling. Please try again.';
        this.isError = true;
        this.isProcessing = false;
      }
    });
  }

  handleCorrectAnswer() {
    this.isSuccess = true;
    this.isError = false;
    this.score += 10;
    this.message = 'Correct! Well done! 🌟';
    this.wordsLearned += 1;

    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }

    if (this.selectedFamily && this.wordsLearned >= this.selectedFamily.total_words) {
      this.completeFamily();
    } else {
      this.animationTimeout = setTimeout(() => {
        this.loadNewWord();
      }, 2000);
    }
    
    this.isProcessing = false;
  }

  handleIncorrectAnswer() {
    this.isSuccess = false;
    this.isError = true;
    this.message = 'Keep trying! You can do it! 💪';

    const gameContainer = document.querySelector('.game-container') as HTMLElement;
    if (gameContainer) {
      gameContainer.classList.add('shake');
      setTimeout(() => {
        gameContainer.classList.remove('shake');
      }, 600);
    }

    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }
    
    this.animationTimeout = setTimeout(() => {
      this.isError = false;
      this.message = '';
      this.userInput = '';
      this.isProcessing = false;
    }, 2000);
  }


  completeFamily() {
    if (!this.selectedFamily) return;

    this.spellingService.markFamilyCompleted(this.selectedFamily.id).subscribe(() => {
      this.spellingService.getReviewSentences(this.selectedFamily!.id).subscribe(sentences => {
        this.reviewSentences = sentences;
        this.highlightedSentences = this.createHighlightedSentences(sentences);
        this.showingReview = true;
      });
    });
  }

  createHighlightedSentences(sentences: string[]): { text: string; highlighted: boolean }[][] {
    if (!this.selectedFamily) return [];

    const learnedWords = this.selectedFamily.words.map(word => word.word.toLowerCase());
    
    return sentences.map(sentence => {
      const words = sentence.split(/(\s+|[.,!?;:])/);
      
      return words.map(word => {
        const cleanWord = word.toLowerCase().replace(/[.,!?;:]/g, '');
        const isLearned = learnedWords.includes(cleanWord);
        
        return {
          text: word,
          highlighted: isLearned && cleanWord.length > 0
        };
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