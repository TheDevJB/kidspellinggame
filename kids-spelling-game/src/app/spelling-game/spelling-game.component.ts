// SPELLING GAME COMPONENT
// This is the main game component where students practice spelling words
// It handles word display, user input, scoring, animations, and progress tracking

// ANGULAR IMPORTS
import { Component, OnInit, OnDestroy } from '@angular/core'; // Component lifecycle hooks
import { CommonModule } from '@angular/common'; // Common Angular directives
import { FormsModule } from '@angular/forms'; // For two-way data binding with forms
import { ActivatedRoute, Router } from '@angular/router'; // For route parameters and navigation
import { Subscription, timer } from 'rxjs'; // For handling observables and timers

// CUSTOM IMPORTS
import { SpellingService, WordFamily, SpellingWord } from '../services/spelling.service'; // Spelling service and interfaces
import { NavTabsComponent } from '../shared/nav-tabs/nav-tabs.component'; // Navigation component

// COMPONENT DECORATOR
@Component({
  // COMPONENT SELECTOR
  selector: 'app-spelling-game',
  
  // STANDALONE COMPONENT
  standalone: true,
  
  // IMPORTS
  // FormsModule is needed for [(ngModel)] two-way data binding
  imports: [CommonModule, FormsModule, NavTabsComponent],
  
  // EXTERNAL TEMPLATE
  // HTML template is in a separate file for better organization
  templateUrl: './spelling-game.component.html',
  
  // EXTERNAL STYLESHEETS
  styleUrls: ['./spelling-game.component.css']
})

// COMPONENT CLASS
// Implements OnInit (for initialization) and OnDestroy (for cleanup)
export class SpellingGameComponent implements OnInit, OnDestroy {
  
  // COMPONENT PROPERTIES
  // These properties store the component's state and data
  
  // DATA PROPERTIES
  wordFamilies: WordFamily[] = []; // All available word families
  selectedFamily: WordFamily | null = null; // Currently selected word family
  currentWord: SpellingWord | null = null; // Current word being practiced
  reviewSentences: string[] = []; // Sentences for review after completing family
  
  // USER INTERACTION PROPERTIES
  userInput: string = ''; // What the user types in the input field
  message: string = ''; // Feedback message shown to user
  score: number = 0; // User's current score
  wordsLearned: number = 0; // Number of words mastered in current family
  
  // UI STATE PROPERTIES
  isWordVisible: boolean = true; // Whether the word is currently shown
  isWordFading: boolean = false; // Whether the word is fading out
  isSuccess: boolean = false; // Whether to show success animation
  isError: boolean = false; // Whether to show error animation
  showingReview: boolean = false; // Whether showing review screen
  
  // PRIVATE PROPERTIES
  // These are internal to the component and not used in the template
  private fadeTimeout: any; // Timeout for word fade animation
  private animationTimeout: any; // Timeout for success/error animations
  private familyId: number | null = null; // ID of selected family from route
  private wordDisplayTimer: Subscription | null = null; // Timer for word display duration

  // DEPENDENCY INJECTION
  constructor(
    private spellingService: SpellingService, // Service for spelling operations
    private route: ActivatedRoute, // For accessing route parameters
    private router: Router // For navigation
  ) {}

  // LIFECYCLE HOOKS

  // COMPONENT INITIALIZATION
  // Called after Angular creates the component
  ngOnInit(): void {
    // ROUTE PARAMETER SUBSCRIPTION
    // Listen for changes in route parameters (like /game/1, /game/2, etc.)
    this.route.params.subscribe(params => {
      // Convert string parameter to number using + operator
      this.familyId = +params['familyId'];
      if (this.familyId) {
        // Load the specific family if ID is provided
        this.loadSelectedFamily();
      }
    });
    
    // Load all word families for potential family switching
    this.loadWordFamilies();
  }

  // COMPONENT CLEANUP
  // Called when Angular destroys the component
  ngOnDestroy(): void {
    // MEMORY LEAK PREVENTION
    // Clear all timeouts and unsubscribe from observables
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

  // DATA LOADING METHODS

  // LOAD ALL WORD FAMILIES
  // Fetches all available word families from the service
  loadWordFamilies() {
    this.spellingService.getWordFamilies().subscribe(families => {
      this.wordFamilies = families;
    });
  }

  // LOAD SELECTED FAMILY
  // Loads the specific family based on route parameter
  loadSelectedFamily() {
    if (this.familyId) {
      this.spellingService.getWordFamily(this.familyId).subscribe(family => {
        if (family) {
          this.selectedFamily = family;
          this.wordsLearned = family.wordsLearned; // Set current progress
          this.loadNewWord(); // Start the game with first word
        }
      });
    }
  }

  // FAMILY SELECTION METHOD
  // Called when user selects a different family (if UI allows)
  selectFamily(family: WordFamily) {
    this.selectedFamily = family;
    this.score = 0; // Reset score
    this.wordsLearned = family.wordsLearned; // Set progress
    this.showingReview = false; // Hide review if showing
    this.loadNewWord(); // Start with new word
  }

  // WORD MANAGEMENT METHODS

  // LOAD NEW WORD
  // Gets a random word from the selected family
  loadNewWord(): void {
    if (this.familyId) {
      this.spellingService.getRandomWord(this.familyId).subscribe(word => {
        this.currentWord = word;
        // Reset UI state for new word
        this.userInput = '';
        this.message = '';
        this.isSuccess = false;
        this.isError = false;
        // Start the word display timer
        this.startWordDisplay();
      });
    }
  }

  // WORD DISPLAY TIMER
  // Shows word for 4 seconds, then fades it out
  startWordDisplay(): void {
    // Reset display state
    this.isWordVisible = true;
    this.isWordFading = false;

    // Cancel any existing timer
    if (this.wordDisplayTimer) {
      this.wordDisplayTimer.unsubscribe();
    }

    // RXJS TIMER
    // Start fading after 4 seconds
    this.wordDisplayTimer = timer(4000).subscribe(() => {
      this.isWordFading = true; // Start fade animation
      
      // JAVASCRIPT TIMEOUT
      // Hide word after fade animation completes (0.4s)
      setTimeout(() => {
        this.isWordVisible = false;
        this.isWordFading = false;
      }, 400);
    });
  }

  // SHOW WORD AGAIN
  // Allows user to see the word again if they need help
  showWordAgain(): void {
    this.startWordDisplay();
  }

  // GAME LOGIC METHODS

  // CHECK SPELLING
  // Validates user's spelling attempt
  checkSpelling(): void {
    // VALIDATION CHECKS
    // Don't check if word is still visible, no current word, or empty input
    if (!this.currentWord || this.isWordVisible || !this.userInput.trim()) return;

    // SPELLING VALIDATION
    // Send user's attempt to service for checking
    this.spellingService.checkSpelling(this.currentWord.id, this.userInput).subscribe(result => {
      if (result.correct) {
        this.handleCorrectAnswer();
      } else {
        this.handleIncorrectAnswer();
      }
    });
  }

  // CORRECT ANSWER HANDLER
  // Handles successful spelling attempts
  handleCorrectAnswer() {
    // UPDATE UI STATE
    this.isSuccess = true; // Show success animation
    this.isError = false;
    this.score += 10; // Award points
    this.message = 'Correct! Well done! 🌟'; // Positive feedback

    // UPDATE PROGRESS
    // Refresh progress from the updated family data
    if (this.selectedFamily) {
      this.wordsLearned = this.selectedFamily.wordsLearned;
    }

    // CLEAR EXISTING TIMEOUT
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }

    // CHECK FAMILY COMPLETION
    // If all words in family are learned, complete the family
    if (this.selectedFamily && this.wordsLearned >= this.selectedFamily.words.length) {
      this.completeFamily();
    } else {
      // CONTINUE WITH NEXT WORD
      // Wait 2 seconds to show success message, then load next word
      this.animationTimeout = setTimeout(() => {
        this.loadNewWord();
      }, 2000);
    }
  }

  // INCORRECT ANSWER HANDLER
  // Handles unsuccessful spelling attempts
  handleIncorrectAnswer() {
    // UPDATE UI STATE
    this.isSuccess = false;
    this.isError = true; // Show error animation
    this.message = 'Keep trying! You can do it! 💪'; // Encouraging feedback

    // CLEAR EXISTING TIMEOUT
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }
    
    // CLEAR ERROR STATE
    // Remove error message after 2 seconds
    this.animationTimeout = setTimeout(() => {
      this.isError = false;
      this.message = '';
    }, 2000);
  }

  // FAMILY COMPLETION METHODS

  // COMPLETE FAMILY
  // Called when all words in a family are mastered
  completeFamily() {
    if (!this.selectedFamily) return;

    // MARK FAMILY AS COMPLETED
    this.spellingService.markFamilyCompleted(this.selectedFamily.id).subscribe(() => {
      // LOAD REVIEW SENTENCES
      // Get example sentences for all words in the family
      this.spellingService.getReviewSentences(this.selectedFamily!.id).subscribe(sentences => {
        this.reviewSentences = sentences;
        this.showingReview = true; // Show review screen
      });
    });
  }

  // PRACTICE SPECIFIC WORD
  // Allows user to practice a specific word from the review screen
  practiceWord(index: number) {
    if (!this.selectedFamily) return;
    
    // EXIT REVIEW MODE
    this.showingReview = false;
    
    // SET SPECIFIC WORD
    this.currentWord = this.selectedFamily.words[index];
    
    // RESET UI STATE
    this.userInput = '';
    this.message = '';
    this.isSuccess = false;
    this.isError = false;
    
    // START WORD DISPLAY
    this.startWordDisplay();
  }

  // NAVIGATION METHODS

  // START NEW FAMILY
  // Navigate back to family selection
  startNewFamily() {
    // RESET COMPONENT STATE
    this.selectedFamily = null;
    this.showingReview = false;
    this.score = 0;
    this.wordsLearned = 0;
    
    // NAVIGATE TO FAMILY SELECTION
    this.router.navigate(['/families']);
  }

  // RESTART CURRENT FAMILY
  // Reset progress and start current family over
  restartFamily() {
    if (!this.selectedFamily) return;
    
    // RESET STATE
    this.showingReview = false;
    this.score = 0;
    this.wordsLearned = 0;
    
    // START OVER WITH NEW WORD
    this.loadNewWord();
  }

  // GO BACK TO FAMILIES
  // Simple navigation back to family selection
  goBackToFamilies(): void {
    this.router.navigate(['/families']);
  }
}
