import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavTabsComponent } from '../shared/nav-tabs/nav-tabs.component';

interface SentenceActivity {
  id: number;
  type: 'word-order' | 'fill-blank' | 'grammar';
  sentence: string;
  scrambledWords?: string[];
  correctOrder?: string[];
  blanks?: { word: string; position: number }[];
  options?: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  hint?: string;
}

@Component({
  selector: 'app-sentence-building',
  
  standalone: true,
  
  imports: [CommonModule, FormsModule, NavTabsComponent],
  
  template: `
    <div class="container">
      <app-nav-tabs></app-nav-tabs>
      
      <button class="back-button" (click)="goBack()">
        Back to  Learning Activities
      </button>

      <div class="header-section">
        <h1>Sentence Building</h1>
        <p class="subtitle">Learn to build perfect sentences!</p>
      </div>

      <div class="activity-selection" *ngIf="!selectedActivity">
        <h2>Choose a Sentence Activity</h2>
        <div class="activities-grid">
          
          <!-- WORD ORDER ACTIVITY -->
          <div class="activity-card" (click)="startActivity('word-order')">
            <div class="activity-icon">🔤</div>
            <h3>Word Order Practice</h3>
            <p>Put words in the correct order to make sentences</p>
            <div class="activity-features">
              <span class="feature">📝 Drag & Drop</span>
              <span class="feature">🎯 Correct Order</span>
              <span class="feature">⭐ Practice</span>
            </div>
            <button class="start-btn">Start Ordering!</button>
          </div>

          <!-- FILL IN THE BLANK ACTIVITY -->
          <div class="activity-card" (click)="startActivity('fill-blank')">
            <div class="activity-icon">📖</div>
            <h3>Fill in the Blanks</h3>
            <p>Complete sentences by choosing the right words</p>
            <div class="activity-features">
              <span class="feature">🔍 Find Words</span>
              <span class="feature">📚 Complete</span>
              <span class="feature">🎮 Fun Games</span>
            </div>
            <button class="start-btn">Fill Blanks!</button>
          </div>

          <!-- GRAMMAR PRACTICE -->
          <div class="activity-card" (click)="startActivity('grammar')">
            <div class="activity-icon">✨</div>
            <h3>Grammar Practice</h3>
            <p>Learn grammar rules and sentence structure</p>
            <div class="activity-features">
              <span class="feature">📏 Rules</span>
              <span class="feature">🔤 Structure</span>
              <span class="feature">🏆 Master</span>
            </div>
            <button class="start-btn">Learn Grammar!</button>
          </div>
        </div>
      </div>

      <!-- WORD ORDER ACTIVITY -->
      <div class="sentence-activity" *ngIf="selectedActivity === 'word-order'">
        <h2>Word Order Practice</h2>
        <div class="word-order-game">
          <div class="instruction-area">
            <h3>Put these words in the correct order:</h3>
            <div class="hint" *ngIf="currentSentence?.hint">
              💡 Hint: {{currentSentence?.hint}}
            </div>
          </div>
          
          <!-- SCRAMBLED WORDS -->
          <div class="scrambled-words">
            <h4>Available Words:</h4>
            <div class="word-bank">
              <button *ngFor="let word of availableWords; let i = index"
                      class="word-button"
                      [class.used]="usedWords.includes(i)"
                      (click)="selectWord(word, i)"
                      [disabled]="usedWords.includes(i)">
                {{word}}
              </button>
            </div>
          </div>

          <!-- SENTENCE BUILDER -->
          <div class="sentence-builder">
            <h4>Your Sentence:</h4>
            <div class="sentence-area">
              <div class="word-slots">
                <span *ngFor="let word of selectedWords; let i = index" 
                      class="selected-word"
                      (click)="removeWord(i)">
                  {{word}}
                  <span class="remove-icon">×</span>
                </span>
                <span class="cursor" *ngIf="selectedWords.length < (currentSentence?.correctOrder?.length || 0)">|</span>
              </div>
            </div>
          </div>

          <!-- CONTROLS -->
          <div class="game-controls">
            <button class="check-btn" 
                    (click)="checkWordOrder()" 
                    [disabled]="selectedWords.length !== (currentSentence?.correctOrder?.length || 0)">
              Check Sentence
            </button>
            <button class="clear-btn" (click)="clearSentence()">
              Clear All
            </button>
            <button class="next-btn" (click)="nextSentence()" *ngIf="showResult">
              Next Sentence
            </button>
          </div>

          <!-- RESULT -->
          <div class="result-message" *ngIf="showResult">
            <div class="message-content" [class.success]="isCorrect" [class.error]="!isCorrect">
              {{resultMessage}}
            </div>
            <div class="correct-sentence" *ngIf="!isCorrect">
              Correct: "{{currentSentence?.correctOrder?.join(' ')}}"
            </div>
          </div>

          <div class="score-display">Score: {{score}}</div>
        </div>
      </div>

      <!-- FILL IN THE BLANK -->
      <div class="sentence-activity" *ngIf="selectedActivity === 'fill-blank'">
        <h2>Fill in the Blanks</h2>
        <div class="fill-blank-game">
          <div class="sentence-display">
            <h3>Complete the sentence:</h3>
            <div class="sentence-with-blanks">
              <span *ngFor="let part of sentenceParts; let i = index">
                <span *ngIf="part.type === 'word'" class="sentence-word">{{part.text}}</span>
                <select *ngIf="part.type === 'blank'" 
                        class="blank-select"
                        [(ngModel)]="part.selected"
                        (change)="onBlankChange()">
                  <option value="">Choose...</option>
                  <option *ngFor="let option of part.options" [value]="option">{{option}}</option>
                </select>
              </span>
            </div>
          </div>

          <div class="hint-area" *ngIf="currentSentence?.hint">
            <div class="hint">💡 {{currentSentence?.hint}}</div>
          </div>

          <div class="fill-controls">
            <button class="check-fill-btn" 
                    (click)="checkFillBlanks()" 
                    [disabled]="!allBlanksCompleted()">
              Check Answer
            </button>
            <button class="next-fill-btn" (click)="nextFillBlank()" *ngIf="showFillResult">
              Next Sentence
            </button>
          </div>

          <div class="fill-result" *ngIf="showFillResult">
            <div class="result-content" [class.success]="isFillCorrect" [class.error]="!isFillCorrect">
              {{fillResultMessage}}
            </div>
          </div>

          <div class="fill-score">Score: {{fillScore}}</div>
        </div>
      </div>

      <!-- GRAMMAR PRACTICE -->
      <div class="sentence-activity" *ngIf="selectedActivity === 'grammar'">
        <h2>Grammar Practice</h2>
        <div class="grammar-game">
          <div class="grammar-lesson">
            <h3>Grammar Rule:</h3>
            <div class="rule-explanation">
              {{currentGrammarRule?.explanation}}
            </div>
            <div class="rule-examples">
              <h4>Examples:</h4>
              <ul>
                <li *ngFor="let example of currentGrammarRule?.examples">{{example}}</li>
              </ul>
            </div>
          </div>

          <div class="grammar-practice">
            <h3>Practice:</h3>
            <div class="grammar-question">
              {{currentGrammarQuestion?.question}}
            </div>
            <div class="grammar-options">
              <button *ngFor="let option of currentGrammarQuestion?.options; let i = index"
                      class="grammar-option"
                      [class.selected]="selectedGrammarOption === i"
                      [class.correct]="showGrammarResult && i === currentGrammarQuestion?.correctAnswer"
                      [class.incorrect]="showGrammarResult && selectedGrammarOption === i && i !== currentGrammarQuestion?.correctAnswer"
                      (click)="selectGrammarOption(i)"
                      [disabled]="showGrammarResult">
                {{option}}
              </button>
            </div>
          </div>

          <div class="grammar-controls">
            <button class="check-grammar-btn" 
                    (click)="checkGrammar()" 
                    [disabled]="selectedGrammarOption === null">
              Check Answer
            </button>
            <button class="next-grammar-btn" (click)="nextGrammar()" *ngIf="showGrammarResult">
              Next Question
            </button>
          </div>

          <div class="grammar-result" *ngIf="showGrammarResult">
            <div class="result-content" [class.success]="isGrammarCorrect" [class.error]="!isGrammarCorrect">
              {{grammarResultMessage}}
            </div>
          </div>

          <div class="grammar-score">Score: {{grammarScore}}</div>
        </div>
      </div>

      <div class="activity-controls" *ngIf="selectedActivity">
        <button class="back-to-activities-btn" (click)="backToActivities()">
          Choose Different Activity
        </button>
      </div>
    </div>
  `,
  
  styleUrls: ['./sentence-building.component.css']
})

export class SentenceBuildingComponent implements OnInit {
  
  gradeLevel: string = '';
  selectedActivity: string | null = null;
  
  currentSentence: SentenceActivity | null = null;
  availableWords: string[] = [];
  selectedWords: string[] = [];
  usedWords: number[] = [];
  showResult: boolean = false;
  isCorrect: boolean = false;
  resultMessage: string = '';
  score: number = 0;
  
  sentenceParts: any[] = [];
  showFillResult: boolean = false;
  isFillCorrect: boolean = false;
  fillResultMessage: string = '';
  fillScore: number = 0;
  
  currentGrammarRule: any = null;
  currentGrammarQuestion: any = null;
  selectedGrammarOption: number | null = null;
  showGrammarResult: boolean = false;
  isGrammarCorrect: boolean = false;
  grammarResultMessage: string = '';
  grammarScore: number = 0;
  //TODO: Figure a new way to implement sentence building
  sentences: SentenceActivity[] = [
    {
      id: 1,
      type: 'word-order',
      sentence: 'The cat sits on the mat.',
      scrambledWords: ['cat', 'sits', 'the', 'mat', 'on', 'The'],
      correctOrder: ['The', 'cat', 'sits', 'on', 'the', 'mat'],
      difficulty: 'easy',
      hint: 'Start with a capital letter'
    },
    {
      id: 2,
      type: 'word-order',
      sentence: 'I like to play outside.',
      scrambledWords: ['like', 'play', 'to', 'outside', 'I'],
      correctOrder: ['I', 'like', 'to', 'play', 'outside'],
      difficulty: 'easy',
      hint: 'Who is doing the action?'
    }
  ];

  fillBlankSentences = [
    {
      id: 1,
      sentence: 'The ___ is red.',
      blanks: [{ word: 'apple', position: 1, options: ['apple', 'car', 'book'] }],
      difficulty: 'easy'
    },
    {
      id: 2,
      sentence: 'I ___ to school every day.',
      blanks: [{ word: 'go', position: 1, options: ['go', 'run', 'fly'] }],
      difficulty: 'easy'
    }
  ];

  grammarRules = [
    {
      id: 1,
      title: 'Capital Letters',
      explanation: 'Always start a sentence with a capital letter.',
      examples: ['The dog runs fast.', 'My name is Sarah.', 'We go to school.']
    },
    {
      id: 2,
      title: 'End Punctuation',
      explanation: 'Every sentence has to end with a period, question mark, or exclamation point.',
      examples: ['I like ice cream.', 'What is your name?', 'That\'s amazing!']
    }
  ];

  grammarQuestions = [
    {
      id: 1,
      question: 'Which sentence starts correctly?',
      options: ['the dog is sleeping', 'The dog is sleeping', 'THE dog is sleeping'],
      correctAnswer: 1
    },
    {
      id: 2,
      question: 'Which sentence ends correctly?',
      options: ['I love pizza', 'I love pizza.', 'I love pizza,'],
      correctAnswer: 1
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  goBack(): void {
    this.router.navigate(['/home']);
  }

  backToActivities(): void {
    this.selectedActivity = null;
    this.resetAllGames();
  }

  startActivity(activityType: string): void {
    this.selectedActivity = activityType;
    this.resetAllGames();
    
    switch (activityType) {
      case 'word-order':
        this.startWordOrderGame();
        break;
      case 'fill-blank':
        this.startFillBlankGame();
        break;
      case 'grammar':
        this.startGrammarGame();
        break;
    }
  }

  resetAllGames(): void {
    this.currentSentence = null;
    this.availableWords = [];
    this.selectedWords = [];
    this.usedWords = [];
    this.showResult = false;
    this.score = 0;
    
    this.sentenceParts = [];
    this.showFillResult = false;
    this.fillScore = 0;
    
    this.currentGrammarRule = null;
    this.currentGrammarQuestion = null;
    this.selectedGrammarOption = null;
    this.showGrammarResult = false;
    this.grammarScore = 0;
  }

  startWordOrderGame(): void {
    this.nextSentence();
  }

  nextSentence(): void {
    const availableSentences = this.sentences.filter(s => s.type === 'word-order');
    
    this.currentSentence = availableSentences.length > 0 
      ? availableSentences[Math.floor(Math.random() * availableSentences.length)]
      : null;
    
    if (this.currentSentence) {
      this.availableWords = [...(this.currentSentence.scrambledWords || [])];
      this.selectedWords = [];
      this.usedWords = [];
      this.showResult = false;
    }
  }

  selectWord(word: string, index: number): void {
    if (this.usedWords.includes(index)) return;
    
    this.selectedWords.push(word);
    this.usedWords.push(index);
  }

  removeWord(index: number): void {
    const removedWord = this.selectedWords[index];
    this.selectedWords.splice(index, 1);
    
    const originalIndex = this.availableWords.findIndex((word, i) => 
      word === removedWord && this.usedWords.includes(i)
    );
    if (originalIndex !== -1) {
      this.usedWords = this.usedWords.filter(i => i !== originalIndex);
    }
  }

  clearSentence(): void {
    this.selectedWords = [];
    this.usedWords = [];
  }

  checkWordOrder(): void {
    if (!this.currentSentence) return;
    
    const userSentence = this.selectedWords.join(' ');
    const correctSentence = this.currentSentence.correctOrder?.join(' ') || '';
    
    this.isCorrect = userSentence.toLowerCase() === correctSentence.toLowerCase();
    this.showResult = true;
    
    if (this.isCorrect) {
      this.score += 10;
      this.resultMessage = '🎉 Perfect! You built the sentence correctly!';
    } else {
      this.resultMessage = '💪 Not quite right. Try again!';
    }
  }

  startFillBlankGame(): void {
    this.nextFillBlank();
  }

  nextFillBlank(): void {
    const sentence = this.fillBlankSentences[Math.floor(Math.random() * this.fillBlankSentences.length)];
    this.createSentenceParts(sentence);
    this.showFillResult = false;
  }

  createSentenceParts(sentence: any): void {
    this.sentenceParts = [];
    const words = sentence.sentence.split(' ');
    
    words.forEach((word: string, index: number) => {
      if (word.includes('___')) {
        const blank = sentence.blanks.find((b: any) => b.position === index);
        this.sentenceParts.push({
          type: 'blank',
          options: blank?.options || [],
          correct: blank?.word,
          selected: ''
        });
      } else {
        this.sentenceParts.push({
          type: 'word',
          text: word + ' '
        });
      }
    });
  }

  onBlankChange(): void {
  }

  allBlanksCompleted(): boolean {
    return this.sentenceParts
      .filter(part => part.type === 'blank')
      .every(blank => blank.selected !== '');
  }

  checkFillBlanks(): void {
    const blanks = this.sentenceParts.filter(part => part.type === 'blank');
    this.isFillCorrect = blanks.every(blank => blank.selected === blank.correct);
    this.showFillResult = true;
    
    if (this.isFillCorrect) {
      this.fillScore += 10;
      this.fillResultMessage = '🎉 Excellent! All blanks are correct!';
    } else {
      this.fillResultMessage = '💪 Some blanks need fixing. Try again!';
    }
  }

  startGrammarGame(): void {
    this.loadGrammarRule();
    this.nextGrammar();
  }

  loadGrammarRule(): void {
    this.currentGrammarRule = this.grammarRules.length > 0 
      ? this.grammarRules[Math.floor(Math.random() * this.grammarRules.length)]
      : this.grammarRules[0];
  }

  nextGrammar(): void {
    this.currentGrammarQuestion = this.grammarQuestions.length > 0
      ? this.grammarQuestions[Math.floor(Math.random() * this.grammarQuestions.length)]
      : this.grammarQuestions[0];
    
    this.selectedGrammarOption = null;
    this.showGrammarResult = false;
  }

  selectGrammarOption(index: number): void {
    if (this.showGrammarResult) return;
    this.selectedGrammarOption = index;
  }

  checkGrammar(): void {
    if (this.selectedGrammarOption === null) return;
    
    this.isGrammarCorrect = this.selectedGrammarOption === this.currentGrammarQuestion?.correctAnswer;
    this.showGrammarResult = true;
    
    if (this.isGrammarCorrect) {
      this.grammarScore += 10;
      this.grammarResultMessage = '🎉 Correct! You know your grammar!';
    } else {
      this.grammarResultMessage = '💪 Keep practicing! You\'ll get it!';
    }
  }
} 