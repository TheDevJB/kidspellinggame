// COLOR LEARNING COMPONENT
// This component provides color learning activities for Pre-K and Kindergarten students
// Includes color identification, color mixing, and interactive challenges

// ANGULAR IMPORTS
import { Component, OnInit } from '@angular/core'; // Component base class and lifecycle hook
import { CommonModule } from '@angular/common'; // Common Angular directives
import { ActivatedRoute, Router } from '@angular/router'; // For route parameters and navigation
import { HttpClient } from '@angular/common/http'; // For API calls
import { NavTabsComponent } from '../shared/nav-tabs/nav-tabs.component'; // Navigation component

// INTERFACES
// Define the structure of color-related data
interface Color {
  id: number;
  name: string;
  hex: string;
  rgb: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'primary' | 'secondary' | 'tertiary';
}

interface ColorLesson {
  id: number;
  title: string;
  description: string;
  colors: Color[];
  type: 'identification' | 'mixing' | 'challenge';
  grade: string;
}

// COMPONENT DECORATOR
@Component({
  // COMPONENT SELECTOR
  selector: 'app-color-learning',
  
  // STANDALONE COMPONENT
  standalone: true,
  
  // IMPORTS
  imports: [CommonModule, NavTabsComponent],
  
  // INLINE TEMPLATE
  template: `
    <!-- MAIN CONTAINER -->
    <div class="container">
      <!-- NAVIGATION TABS -->
      <app-nav-tabs></app-nav-tabs>
      
      <!-- BACK BUTTON -->
      <button class="back-button" (click)="goBack()">
        ← Back to Activities
      </button>

      <!-- HEADER SECTION -->
      <div class="header-section">
        <h1>🎨 Color Learning for {{gradeLevel | titlecase}}</h1>
        <p class="subtitle">Let's explore the wonderful world of colors!</p>
      </div>

      <!-- LESSON SELECTION -->
      <div class="lesson-selection" *ngIf="!selectedLesson">
        <h2>Choose a Color Activity</h2>
        <div class="lessons-grid">
          
          <!-- COLOR IDENTIFICATION LESSON -->
          <div class="lesson-card" (click)="startLesson('identification')">
            <div class="lesson-icon">👁️</div>
            <h3>Color Identification</h3>
            <p>Learn to recognize and name different colors</p>
            <div class="lesson-features">
              <span class="feature">🔴 Red</span>
              <span class="feature">🟡 Yellow</span>
              <span class="feature">🔵 Blue</span>
              <span class="feature">🟢 Green</span>
            </div>
            <button class="start-btn">Start Learning!</button>
          </div>

          <!-- COLOR MIXING LESSON -->
          <div class="lesson-card" (click)="startLesson('mixing')">
            <div class="lesson-icon">🎭</div>
            <h3>Color Mixing</h3>
            <p>Discover what happens when you mix colors together</p>
            <div class="lesson-features">
              <span class="feature">🔴 + 🟡 = 🟠</span>
              <span class="feature">🔵 + 🟡 = 🟢</span>
              <span class="feature">🔴 + 🔵 = 🟣</span>
            </div>
            <button class="start-btn">Mix Colors!</button>
          </div>

          <!-- COLOR CHALLENGE -->
          <div class="lesson-card" (click)="startLesson('challenge')">
            <div class="lesson-icon">🎯</div>
            <h3>Color Challenge</h3>
            <p>Test your color knowledge with fun games</p>
            <div class="lesson-features">
              <span class="feature">🎮 Games</span>
              <span class="feature">⭐ Points</span>
              <span class="feature">🏆 Rewards</span>
            </div>
            <button class="start-btn">Take Challenge!</button>
          </div>
        </div>
      </div>

      <!-- COLOR IDENTIFICATION ACTIVITY -->
      <div class="color-activity" *ngIf="selectedLesson === 'identification'">
        <h2>Color Identification</h2>
        <div class="identification-game">
          <div class="question-area">
            <h3>What color is this?</h3>
            <div class="color-display" 
                 [style.background-color]="currentColor.hex"
                 *ngIf="currentColor">
            </div>
          </div>
          
          <div class="answer-options">
            <button *ngFor="let option of colorOptions" 
                    class="color-option"
                    [class.correct]="showResult && option.id === currentColor?.id"
                    [class.incorrect]="showResult && selectedAnswer === option.id && option.id !== currentColor?.id"
                    (click)="selectColor(option)"
                    [disabled]="showResult">
              {{option.name}}
            </button>
          </div>

          <div class="result-message" *ngIf="showResult">
            <div class="message-content" [class.success]="isCorrect" [class.error]="!isCorrect">
              {{resultMessage}}
            </div>
          </div>

          <div class="game-controls">
            <button class="next-btn" (click)="nextColor()" *ngIf="showResult">
              Next Color
            </button>
            <div class="score">Score: {{score}}</div>
          </div>
        </div>
      </div>

      <!-- COLOR MIXING ACTIVITY -->
      <div class="color-activity" *ngIf="selectedLesson === 'mixing'">
        <h2>Color Mixing Laboratory</h2>
        <div class="mixing-game">
          <div class="mixing-area">
            <h3>Mix these colors together:</h3>
            <div class="colors-to-mix">
              <div class="color-circle" 
                   [style.background-color]="mixingChallenge?.color1"
                   *ngIf="mixingChallenge">
              </div>
              <span class="plus">+</span>
              <div class="color-circle" 
                   [style.background-color]="mixingChallenge?.color2"
                   *ngIf="mixingChallenge">
              </div>
              <span class="equals">=</span>
              <div class="result-circle" 
                   [style.background-color]="mixedResult || '#f0f0f0'">
                <span *ngIf="!mixedResult">?</span>
              </div>
            </div>
          </div>

          <div class="mixing-options">
            <h4>What color do you get?</h4>
            <div class="color-choices">
              <button *ngFor="let choice of mixingChoices"
                      class="color-choice"
                      [style.background-color]="choice.hex"
                      [class.selected]="selectedMixResult === choice.id"
                      (click)="selectMixResult(choice)">
                {{choice.name}}
              </button>
            </div>
          </div>

          <div class="mixing-controls">
            <button class="mix-btn" (click)="checkMixing()" [disabled]="!selectedMixResult">
              Mix Colors!
            </button>
            <button class="next-mix-btn" (click)="nextMixing()" *ngIf="showMixResult">
              Try Another Mix
            </button>
          </div>

          <div class="mix-result" *ngIf="showMixResult">
            <div class="result-content" [class.success]="isMixCorrect" [class.error]="!isMixCorrect">
              {{mixResultMessage}}
            </div>
          </div>
        </div>
      </div>

      <!-- COLOR CHALLENGE ACTIVITY -->
      <div class="color-activity" *ngIf="selectedLesson === 'challenge'">
        <h2>Color Challenge Arena</h2>
        <div class="challenge-game">
          <div class="challenge-header">
            <div class="timer">Time: {{timeLeft}}s</div>
            <div class="challenge-score">Score: {{challengeScore}}</div>
            <div class="level">Level: {{challengeLevel}}</div>
          </div>

          <div class="challenge-question" *ngIf="challengeQuestion">
            <h3>{{challengeQuestion.question}}</h3>
            <div class="challenge-visual" [ngSwitch]="challengeQuestion.type">
              
              <!-- Color matching challenge -->
              <div *ngSwitchCase="'match'" class="color-match">
                <div class="target-color" [style.background-color]="challengeQuestion.targetColor"></div>
                <p>Find the matching color!</p>
                <div class="color-grid">
                  <button *ngFor="let color of challengeQuestion.options"
                          class="color-tile"
                          [style.background-color]="color.hex"
                          (click)="answerChallenge(color.id)">
                  </button>
                </div>
              </div>

              <!-- Color sequence challenge -->
              <div *ngSwitchCase="'sequence'" class="color-sequence">
                <p>Complete the pattern:</p>
                <div class="sequence-display">
                  <div *ngFor="let color of challengeQuestion.sequence; let i = index"
                       class="sequence-item"
                       [style.background-color]="color || '#f0f0f0'">
                    <span *ngIf="!color">?</span>
                  </div>
                </div>
                <div class="sequence-options">
                  <button *ngFor="let option of challengeQuestion.options"
                          class="sequence-option"
                          [style.background-color]="option.hex"
                          (click)="answerChallenge(option.id)">
                    {{option.name}}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="challenge-result" *ngIf="showChallengeResult">
            <div class="result-content" [class.success]="isChallengeCorrect" [class.error]="!isChallengeCorrect">
              {{challengeResultMessage}}
            </div>
          </div>
        </div>
      </div>

      <!-- LESSON CONTROLS -->
      <div class="lesson-controls" *ngIf="selectedLesson">
        <button class="back-to-lessons-btn" (click)="backToLessons()">
          Choose Different Activity
        </button>
      </div>
    </div>
  `,
  
  // EXTERNAL STYLESHEET
  styleUrls: ['./color-learning.component.css']
})

// COMPONENT CLASS
export class ColorLearningComponent implements OnInit {
  
  // COMPONENT PROPERTIES
  gradeLevel: string = '';
  selectedLesson: string | null = null;
  
  // COLOR IDENTIFICATION PROPERTIES
  currentColor: Color | null = null;
  colorOptions: Color[] = [];
  selectedAnswer: number | null = null;
  showResult: boolean = false;
  isCorrect: boolean = false;
  resultMessage: string = '';
  score: number = 0;
  
  // COLOR MIXING PROPERTIES
  mixingChallenge: any = null;
  mixingChoices: Color[] = [];
  selectedMixResult: number | null = null;
  mixedResult: string | null = null;
  showMixResult: boolean = false;
  isMixCorrect: boolean = false;
  mixResultMessage: string = '';
  
  // COLOR CHALLENGE PROPERTIES
  challengeQuestion: any = null;
  challengeScore: number = 0;
  challengeLevel: number = 1;
  timeLeft: number = 30;
  showChallengeResult: boolean = false;
  isChallengeCorrect: boolean = false;
  challengeResultMessage: string = '';
  
  // SAMPLE COLOR DATA
  colors: Color[] = [
    { id: 1, name: 'Red', hex: '#FF0000', rgb: '255,0,0', difficulty: 'easy', category: 'primary' },
    { id: 2, name: 'Blue', hex: '#0000FF', rgb: '0,0,255', difficulty: 'easy', category: 'primary' },
    { id: 3, name: 'Yellow', hex: '#FFFF00', rgb: '255,255,0', difficulty: 'easy', category: 'primary' },
    { id: 4, name: 'Green', hex: '#00FF00', rgb: '0,255,0', difficulty: 'medium', category: 'secondary' },
    { id: 5, name: 'Orange', hex: '#FFA500', rgb: '255,165,0', difficulty: 'medium', category: 'secondary' },
    { id: 6, name: 'Purple', hex: '#800080', rgb: '128,0,128', difficulty: 'medium', category: 'secondary' },
    { id: 7, name: 'Pink', hex: '#FFC0CB', rgb: '255,192,203', difficulty: 'medium', category: 'tertiary' },
    { id: 8, name: 'Brown', hex: '#A52A2A', rgb: '165,42,42', difficulty: 'hard', category: 'tertiary' }
  ];

  // DEPENDENCY INJECTION
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  // LIFECYCLE HOOK
  ngOnInit(): void {
    // Get grade level from route parameter
    this.route.params.subscribe(params => {
      this.gradeLevel = params['grade'] || 'pre-k';
    });
  }

  // NAVIGATION METHODS
  goBack(): void {
    this.router.navigate(['/home']);
  }

  backToLessons(): void {
    this.selectedLesson = null;
    this.resetAllGames();
  }

  // LESSON MANAGEMENT
  startLesson(lessonType: string): void {
    this.selectedLesson = lessonType;
    this.resetAllGames();
    
    switch (lessonType) {
      case 'identification':
        this.startIdentificationGame();
        break;
      case 'mixing':
        this.startMixingGame();
        break;
      case 'challenge':
        this.startChallengeGame();
        break;
    }
  }

  resetAllGames(): void {
    // Reset identification game
    this.currentColor = null;
    this.colorOptions = [];
    this.selectedAnswer = null;
    this.showResult = false;
    this.score = 0;
    
    // Reset mixing game
    this.mixingChallenge = null;
    this.selectedMixResult = null;
    this.mixedResult = null;
    this.showMixResult = false;
    
    // Reset challenge game
    this.challengeQuestion = null;
    this.challengeScore = 0;
    this.challengeLevel = 1;
    this.timeLeft = 30;
    this.showChallengeResult = false;
  }

  // COLOR IDENTIFICATION GAME
  startIdentificationGame(): void {
    this.nextColor();
  }

  nextColor(): void {
    // Select appropriate colors based on grade level
    const availableColors = this.gradeLevel === 'pre-k' 
      ? this.colors.filter(c => c.difficulty === 'easy')
      : this.colors.filter(c => c.difficulty === 'easy' || c.difficulty === 'medium');
    
    // Pick random color
    this.currentColor = availableColors[Math.floor(Math.random() * availableColors.length)];
    
    // Create options (correct answer + 3 wrong answers)
    this.colorOptions = [this.currentColor];
    const wrongOptions = availableColors.filter(c => c.id !== this.currentColor!.id);
    for (let i = 0; i < 3 && wrongOptions.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * wrongOptions.length);
      this.colorOptions.push(wrongOptions.splice(randomIndex, 1)[0]);
    }
    
    // Shuffle options
    this.colorOptions = this.colorOptions.sort(() => Math.random() - 0.5);
    
    // Reset state
    this.selectedAnswer = null;
    this.showResult = false;
  }

  selectColor(color: Color): void {
    if (this.showResult) return;
    
    this.selectedAnswer = color.id;
    this.isCorrect = color.id === this.currentColor?.id;
    this.showResult = true;
    
    if (this.isCorrect) {
      this.score += 10;
      this.resultMessage = `🎉 Correct! That's ${this.currentColor?.name}!`;
    } else {
      this.resultMessage = `Try again! That's ${this.currentColor?.name}.`;
    }
  }

  // COLOR MIXING GAME
  startMixingGame(): void {
    this.nextMixing();
  }

  nextMixing(): void {
    // Define mixing combinations
    const mixingCombos = [
      { color1: '#FF0000', color2: '#FFFF00', result: '#FFA500', resultName: 'Orange' }, // Red + Yellow = Orange
      { color1: '#0000FF', color2: '#FFFF00', result: '#00FF00', resultName: 'Green' },  // Blue + Yellow = Green
      { color1: '#FF0000', color2: '#0000FF', result: '#800080', resultName: 'Purple' }  // Red + Blue = Purple
    ];
    
    // Pick random combination
    const combo = mixingCombos[Math.floor(Math.random() * mixingCombos.length)];
    this.mixingChallenge = combo;
    
    // Create choices with proper RGB values based on the result color
    const getRgbFromHex = (hex: string): string => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `${r},${g},${b}`;
    };

    this.mixingChoices = [
      { id: 1, name: combo.resultName, hex: combo.result, rgb: getRgbFromHex(combo.result), difficulty: 'medium' as const, category: 'secondary' as const },
      { id: 2, name: 'Pink', hex: '#FFC0CB', rgb: '255,192,203', difficulty: 'medium' as const, category: 'tertiary' as const },
      { id: 3, name: 'Brown', hex: '#A52A2A', rgb: '165,42,42', difficulty: 'hard' as const, category: 'tertiary' as const }
    ].sort(() => Math.random() - 0.5);
    
    // Reset state
    this.selectedMixResult = null;
    this.mixedResult = null;
    this.showMixResult = false;
  }

  selectMixResult(choice: Color): void {
    this.selectedMixResult = choice.id;
  }

  checkMixing(): void {
    if (!this.selectedMixResult) return;
    
    const selectedChoice = this.mixingChoices.find(c => c.id === this.selectedMixResult);
    this.mixedResult = selectedChoice?.hex || '';
    this.isMixCorrect = selectedChoice?.hex === this.mixingChallenge.result;
    this.showMixResult = true;
    
    if (this.isMixCorrect) {
      this.mixResultMessage = `🎨 Perfect! ${this.mixingChallenge.resultName} is correct!`;
    } else {
      this.mixResultMessage = `Not quite! Try mixing again to get ${this.mixingChallenge.resultName}.`;
    }
  }

  // COLOR CHALLENGE GAME
  startChallengeGame(): void {
    this.generateChallengeQuestion();
    this.startTimer();
  }

  generateChallengeQuestion(): void {
    const questionTypes = ['match', 'sequence'];
    const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    if (type === 'match') {
      const targetColor = this.colors[Math.floor(Math.random() * this.colors.length)];
      const wrongColors = this.colors.filter(c => c.id !== targetColor.id).slice(0, 3);
      const options = [targetColor, ...wrongColors].sort(() => Math.random() - 0.5);
      
      this.challengeQuestion = {
        type: 'match',
        question: 'Find the color that matches!',
        targetColor: targetColor.hex,
        correctAnswer: targetColor.id,
        options: options
      };
    } else {
      // Color sequence challenge
      const sequence = ['#FF0000', '#00FF00', '#0000FF', null]; // Red, Green, Blue, ?
      const correctAnswer = this.colors.find(c => c.hex === '#FFFF00'); // Yellow
      const wrongOptions = this.colors.filter(c => c.hex !== '#FFFF00').slice(0, 2);
      const options = [correctAnswer!, ...wrongOptions].sort(() => Math.random() - 0.5);
      
      this.challengeQuestion = {
        type: 'sequence',
        question: 'What comes next in the pattern?',
        sequence: sequence,
        correctAnswer: correctAnswer!.id,
        options: options
      };
    }
    
    this.showChallengeResult = false;
  }

  answerChallenge(answerId: number): void {
    if (this.showChallengeResult) return;
    
    this.isChallengeCorrect = answerId === this.challengeQuestion.correctAnswer;
    this.showChallengeResult = true;
    
    if (this.isChallengeCorrect) {
      this.challengeScore += 10 * this.challengeLevel;
      this.challengeResultMessage = '🏆 Excellent! You got it right!';
      
      // Generate next question after delay
      setTimeout(() => {
        this.generateChallengeQuestion();
        this.challengeLevel++;
      }, 2000);
    } else {
      this.challengeResultMessage = '💪 Keep trying! You can do it!';
      
      // Try again after delay
      setTimeout(() => {
        this.showChallengeResult = false;
      }, 2000);
    }
  }

  startTimer(): void {
    const timer = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        clearInterval(timer);
        // End challenge
        this.challengeResultMessage = `🎯 Time's up! Final score: ${this.challengeScore}`;
        this.showChallengeResult = true;
      }
    }, 1000);
  }
} 