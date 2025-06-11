// SPELLING SERVICE - BUSINESS LOGIC FOR SPELLING GAME
// This service handles all the spelling-related functionality
// Services in Angular are like "helper classes" that can be shared across components

// ANGULAR IMPORTS
import { Injectable } from '@angular/core'; // Makes this class available for dependency injection
import { HttpClient } from '@angular/common/http'; // For making API calls to your backend
import { Observable, of } from 'rxjs'; // For handling asynchronous data (like API responses)

// TYPESCRIPT INTERFACES
// Interfaces define the "shape" of data objects - like a contract for what properties an object must have

// SPELLING WORD INTERFACE
// Defines what a spelling word object looks like
export interface SpellingWord {
  id: number; // Unique identifier for the word
  word: string; // The actual word to spell (e.g., "cat")
  familyId: number; // Which word family this belongs to (e.g., AT family)
  exampleSentence: string; // Example sentence using the word
  mastered: boolean; // Whether the student has successfully learned this word
}

// WORD FAMILY INTERFACE
// Defines what a word family object looks like (e.g., AT family: cat, hat, mat)
export interface WordFamily {
  id: number; // Unique identifier for the family
  name: string; // Display name (e.g., "AT Family")
  description: string; // Description of the family
  pattern: string; // The pattern (e.g., "-at")
  difficulty: 'easy' | 'medium' | 'hard'; // Difficulty level
  words: SpellingWord[]; // Array of words in this family
  completed: boolean; // Whether student has completed this family
  inProgress: boolean; // Whether student is currently working on this family
  wordsLearned: number; // How many words the student has mastered
}

// SERVICE DECORATOR
// @Injectable tells Angular this class can be injected into other classes
// providedIn: 'root' means this service is available throughout the entire app (singleton)
@Injectable({
  providedIn: 'root'
})

// SPELLING SERVICE CLASS
// Contains all the business logic for the spelling game
export class SpellingService {
  // PRIVATE PROPERTIES
  // API URL for backend communication
  private apiUrl = 'http://localhost:3000/api/spelling';

  // SAMPLE DATA
  // In a real app, this data would come from your backend API
  // This is temporary data for development and testing
  private wordFamilies: WordFamily[] = [
    {
      id: 1,
      name: 'AT Family', // Family name displayed to users
      description: 'Words that end with -at', // Explanation for students
      pattern: '-at', // The sound pattern
      difficulty: 'easy', // Appropriate for beginners
      completed: false, // Student hasn't finished this family yet
      inProgress: false, // Student hasn't started this family yet
      wordsLearned: 0, // No words mastered yet
      words: [
        // Array of words in the AT family
        { id: 1, word: 'cat', familyId: 1, exampleSentence: 'The cat sat on the mat.', mastered: false },
        { id: 2, word: 'hat', familyId: 1, exampleSentence: 'I wear my hat in the sun.', mastered: false },
        { id: 3, word: 'mat', familyId: 1, exampleSentence: 'Please wipe your feet on the mat.', mastered: false },
        { id: 4, word: 'rat', familyId: 1, exampleSentence: 'The rat ran very fast.', mastered: false }
      ]
    },
    {
      id: 2,
      name: 'AN Family',
      description: 'Words that end with -an',
      pattern: '-an',
      difficulty: 'easy',
      completed: false,
      inProgress: false,
      wordsLearned: 0,
      words: [
        { id: 5, word: 'can', familyId: 2, exampleSentence: 'I can jump very high.', mastered: false },
        { id: 6, word: 'fan', familyId: 2, exampleSentence: 'The fan spins around.', mastered: false },
        { id: 7, word: 'man', familyId: 2, exampleSentence: 'The man is very tall.', mastered: false },
        { id: 8, word: 'ran', familyId: 2, exampleSentence: 'She ran to the park.', mastered: false }
      ]
    },
    {
      id: 3,
      name: 'ING Family',
      description: 'Words that end with -ing',
      pattern: '-ing',
      difficulty: 'medium', // Slightly harder for more advanced students
      completed: false,
      inProgress: false,
      wordsLearned: 0,
      words: [
        { id: 9, word: 'sing', familyId: 3, exampleSentence: 'I love to sing songs.', mastered: false },
        { id: 10, word: 'ring', familyId: 3, exampleSentence: 'The bell will ring soon.', mastered: false },
        { id: 11, word: 'wing', familyId: 3, exampleSentence: 'The bird has a broken wing.', mastered: false },
        { id: 12, word: 'spring', familyId: 3, exampleSentence: 'Flowers bloom in spring.', mastered: false }
      ]
    }
  ];

  // DEPENDENCY INJECTION
  // Angular automatically provides an HttpClient instance when this service is created
  constructor(private http: HttpClient) { }

  // SERVICE METHODS
  // These methods provide functionality that components can use

  // GET ALL WORD FAMILIES
  // Returns an Observable (like a Promise) containing all word families
  getWordFamilies(): Observable<WordFamily[]> {
    // In production, this would be: return this.http.get<WordFamily[]>(`${this.apiUrl}/families`);
    // For now, we return the sample data wrapped in an Observable
    return of(this.wordFamilies);
  }

  // GET SPECIFIC WORD FAMILY
  // Returns a specific word family by its ID
  getWordFamily(familyId: number): Observable<WordFamily | undefined> {
    // Find the family with the matching ID
    return of(this.wordFamilies.find(family => family.id === familyId));
  }

  // GET RANDOM WORD
  // Returns a random word, optionally from a specific family
  getRandomWord(familyId?: number): Observable<SpellingWord> {
    if (familyId) {
      // If a specific family is requested
      const family = this.wordFamilies.find(f => f.id === familyId);
      if (family) {
        // SMART WORD SELECTION
        // Prioritize words the student hasn't mastered yet
        const unmastered = family.words.filter(w => !w.mastered);
        if (unmastered.length > 0) {
          // Pick a random unmastered word
          const randomIndex = Math.floor(Math.random() * unmastered.length);
          return of(unmastered[randomIndex]);
        }
        // If all words are mastered, pick any word for review
        const randomIndex = Math.floor(Math.random() * family.words.length);
        return of(family.words[randomIndex]);
      }
    }
    // Fallback: pick a random word from all families
    const allWords = this.wordFamilies.flatMap(f => f.words); // Flatten all words into one array
    const randomIndex = Math.floor(Math.random() * allWords.length);
    return of(allWords[randomIndex]);
  }

  // CHECK SPELLING ATTEMPT
  // Compares student's spelling attempt with the correct word
  checkSpelling(wordId: number, attempt: string): Observable<any> {
    // Find all words across all families
    const allWords = this.wordFamilies.flatMap(f => f.words);
    
    // Find the specific word being checked
    const word = allWords.find(w => w.id === wordId);
    
    // Compare spelling (case-insensitive)
    const isCorrect = word?.word.toLowerCase() === attempt.toLowerCase();
    
    // UPDATE PROGRESS IF CORRECT
    if (word && isCorrect && !word.mastered) {
      // Mark word as mastered
      word.mastered = true;
      
      // Update family progress
      const family = this.wordFamilies.find(f => f.id === word.familyId);
      if (family) {
        family.wordsLearned++; // Increment words learned counter
        family.inProgress = true; // Mark family as in progress
        
        // Check if family is completed
        if (family.wordsLearned === family.words.length) {
          family.completed = true; // All words mastered!
          family.inProgress = false; // No longer in progress
        }
      }
    }

    // Return result
    return of({
      correct: isCorrect,
      word: word
    });
  }

  // START WORKING ON A FAMILY
  // Marks a family as "in progress" when student begins
  startFamily(familyId: number): Observable<boolean> {
    const family = this.wordFamilies.find(f => f.id === familyId);
    if (family && !family.completed) {
      family.inProgress = true;
      return of(true); // Success
    }
    return of(false); // Failed (family not found or already completed)
  }

  // MARK FAMILY AS COMPLETED
  // Manually mark a family as completed
  markFamilyCompleted(familyId: number): Observable<boolean> {
    const family = this.wordFamilies.find(f => f.id === familyId);
    if (family) {
      family.completed = true;
      family.inProgress = false;
      return of(true);
    }
    return of(false);
  }

  // RESET FAMILY PROGRESS
  // Allows student to restart a family from the beginning
  resetFamily(familyId: number): Observable<boolean> {
    const family = this.wordFamilies.find(f => f.id === familyId);
    if (family) {
      // Reset all progress
      family.completed = false;
      family.inProgress = false;
      family.wordsLearned = 0;
      // Reset all words to unmastered
      family.words.forEach((word: SpellingWord) => word.mastered = false);
      return of(true);
    }
    return of(false);
  }

  // GET REVIEW SENTENCES
  // Returns example sentences for all words in a family
  // Used for the sentence review feature after completing a family
  getReviewSentences(familyId: number): Observable<string[]> {
    const family = this.wordFamilies.find(f => f.id === familyId);
    if (family) {
      // Extract example sentences from all words in the family
      return of(family.words.map((word: SpellingWord) => word.exampleSentence));
    }
    return of([]); // Return empty array if family not found
  }
}
