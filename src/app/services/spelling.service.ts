import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface WordFamily {
  id: number;
  name: string;
  description: string;
  pattern: string;
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  in_progress: boolean;
  words_learned: number;
  total_words: number;
  words: Word[];
}

export interface Word {
  id: number;
  word: string;
  family_id: number;
  example_sentence: string;
  mastered: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SpellingService {
  private apiUrl = 'http://localhost:3000/api/spelling';
  
  private currentFamilySubject = new BehaviorSubject<WordFamily | null>(null);
  public currentFamily$ = this.currentFamilySubject.asObservable();
  
  private currentWordIndexSubject = new BehaviorSubject<number>(0);
  public currentWordIndex$ = this.currentWordIndexSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Get all word families from database
  getWordFamilies(): Observable<WordFamily[]> {
    return this.http.get<WordFamily[]>(`${this.apiUrl}/families`);
  }

  // Get specific word family from database
  getWordFamily(familyId: number): Observable<WordFamily> {
    return this.http.get<WordFamily>(`${this.apiUrl}/families/${familyId}`);
  }

  // Get random word from database
  getRandomWord(familyIdOrDifficulty?: number | string, family?: string): Observable<Word> {
    // Handle both old signature (difficulty, family) and new signature (familyId)
    if (typeof familyIdOrDifficulty === 'number') {
      // New signature: getRandomWord(familyId)
      return this.http.get<Word>(`${this.apiUrl}/families/${familyIdOrDifficulty}/random-word`);
    } else {
      // Old signature: getRandomWord(difficulty?, family?)
      let params = '';
      if (familyIdOrDifficulty || family) {
        const queryParams = [];
        if (familyIdOrDifficulty) queryParams.push(`difficulty=${familyIdOrDifficulty}`);
        if (family) queryParams.push(`family=${family}`);
        params = '?' + queryParams.join('&');
      }
      return this.http.get<Word>(`${this.apiUrl}/word${params}`);
    }
  }

  // Check spelling attempt
  checkSpelling(wordId: number, userAnswer: string, userId?: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/check`, {
      wordId,
      userAnswer,
      userId
    });
  }

  // Get review sentences for a word family
  getReviewSentences(familyId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/families/${familyId}/sentences`);
  }

  // Mark family as completed
  markFamilyCompleted(familyId: number, userId?: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/families/${familyId}/complete`, {
      userId: userId || 1 // Default user ID for now
    });
  }

  // Get user progress
  getUserProgress(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/progress/${userId}`);
  }

  // Add new word
  addWord(word: string, familyId: number, exampleSentence: string): Observable<Word> {
    return this.http.post<Word>(`${this.apiUrl}/add`, {
      word,
      familyId,
      exampleSentence
    });
  }

  // Local state management methods (keep these for compatibility)
  setCurrentFamily(family: WordFamily): void {
    this.currentFamilySubject.next(family);
    this.currentWordIndexSubject.next(0);
  }

  getCurrentFamily(): WordFamily | null {
    return this.currentFamilySubject.value;
  }

  getCurrentWord(): Word | null {
    const family = this.getCurrentFamily();
    const index = this.currentWordIndexSubject.value;
    
    if (family && family.words && index < family.words.length) {
      return family.words[index];
    }
    return null;
  }

  nextWord(): boolean {
    const family = this.getCurrentFamily();
    const currentIndex = this.currentWordIndexSubject.value;
    
    if (family && currentIndex < family.words.length - 1) {
      this.currentWordIndexSubject.next(currentIndex + 1);
      return true;
    }
    return false;
  }

  submitSpellingAttempt(wordId: number, familyId: number, isCorrect: boolean): void {
    console.log('Spelling attempt:', { wordId, familyId, isCorrect });
  }

  resetGameState(): void {
    this.currentFamilySubject.next(null);
    this.currentWordIndexSubject.next(0);
  }
} 
