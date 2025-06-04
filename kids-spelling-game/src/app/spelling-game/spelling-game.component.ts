import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpellingService } from '../services/spelling.service';

@Component({
  selector: 'app-spelling-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="game-container">
      <h2>Spelling Game</h2>
      <div class="score">Score: {{score}}</div>
      
      <div class="game-area">
        <!-- Show hint when available -->
        <div class="hint" *ngIf="showHint && currentWord">
          Hint: {{currentWord.hint}}
        </div>

        <div class="input-area">
          <!-- Display current word for testing -->
          <p class="current-word">Listen and spell: "{{currentWord?.word}}"</p>
          
          <input type="text" 
                 [(ngModel)]="userInput" 
                 placeholder="Type the word here..."
                 (keyup.enter)="checkAnswer()">
          
          <div class="buttons">
            <button (click)="checkAnswer()" class="check-btn">Check Answer</button>
            <button (click)="showHintClicked()" class="hint-btn" [disabled]="showHint">Need a Hint?</button>
            <button (click)="getNewWord()" class="next-btn">Next Word</button>
          </div>
        </div>

        <div class="message">
          {{message}}
        </div>
      </div>
    </div>
  `,
  styleUrl: './spelling-game.component.css'
})
export class SpellingGameComponent implements OnInit {
  currentWord: any = null;
  userInput: string = '';
  message: string = '';
  score: number = 0;
  showHint: boolean = false;

  constructor(private spellingService: SpellingService) {}

  ngOnInit() {
    this.getNewWord();
  }

  getNewWord() {
    this.spellingService.getRandomWord().subscribe(word => {
      this.currentWord = word;
      this.userInput = '';
      this.message = '';
      this.showHint = false;
    });
  }

  checkAnswer() {
    if (!this.userInput.trim()) {
      this.message = 'Please type a word!';
      return;
    }

    this.spellingService.checkSpelling(this.currentWord.id, this.userInput)
      .subscribe(result => {
        if (result.correct) {
          this.score += 10;
          this.message = 'Correct! Well done! 🌟';
          setTimeout(() => this.getNewWord(), 1500);
        } else {
          this.message = 'Try again!';
          this.showHint = true;
        }
      });
  }

  showHintClicked() {
    this.showHint = true;
  }
}
