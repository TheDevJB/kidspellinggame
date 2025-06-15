import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface SpellingWord {
  id: number;
  word: string;
  familyId: number;
  exampleSentence: string;
  mastered: boolean;
}

export interface WordFamily {
  id: number;
  name: string;
  description: string;
  pattern: string;
  difficulty: 'easy' | 'medium' | 'hard';
  words: SpellingWord[];
  completed: boolean;
  inProgress: boolean;
  wordsLearned: number;
  total_words: number;
}

@Injectable({
  providedIn: 'root'
})

export class SpellingService {
  private apiUrl = 'http://localhost:3000/api/spelling';

  private wordFamilies: WordFamily[] = [
    {
      id: 1,
      name: 'AT Family',
      description: 'Words that end with -at',
      pattern: '-at',
      difficulty: 'easy',
      completed: false,
      inProgress: false,
      wordsLearned: 0,
      total_words: 0,
      words: [
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
      total_words: 0,
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
      difficulty: 'medium',
      completed: false,
      inProgress: false,
      wordsLearned: 0,
      total_words: 0,
      words: [
        { id: 9, word: 'sing', familyId: 3, exampleSentence: 'I love to sing songs.', mastered: false },
        { id: 10, word: 'ring', familyId: 3, exampleSentence: 'The bell will ring soon.', mastered: false },
        { id: 11, word: 'wing', familyId: 3, exampleSentence: 'The bird has a broken wing.', mastered: false },
        { id: 12, word: 'spring', familyId: 3, exampleSentence: 'Flowers bloom in spring.', mastered: false }
      ]
    }
  ];

  constructor(private http: HttpClient) { }


  getWordFamilies(): Observable<WordFamily[]> {
    // Fetch from MySQL database instead of using hardcoded data
    return this.http.get<WordFamily[]>(`${this.apiUrl}/families`);
  }

  getWordFamily(familyId: number): Observable<WordFamily | undefined> {
    // Fetch specific family from MySQL database
    return this.http.get<WordFamily>(`${this.apiUrl}/families/${familyId}`);
  }

  getRandomWord(familyId?: number): Observable<SpellingWord> {
    // Fetch random word from MySQL database using the correct endpoint
    if (familyId) {
      return this.http.get<SpellingWord>(`${this.apiUrl}/families/${familyId}/random-word`);
    } else {
      return this.http.get<SpellingWord>(`${this.apiUrl}/word`);
    }
  }

  checkSpelling(wordId: number, attempt: string): Observable<any> {
    // Send spelling attempt to MySQL database
    return this.http.post(`${this.apiUrl}/check`, {
      wordId: wordId,
      userAnswer: attempt,
      userId: 1 // You can make this dynamic later
    });
  }

  startFamily(familyId: number): Observable<boolean> {
    const family = this.wordFamilies.find(f => f.id === familyId);
    if (family && !family.completed) {
      family.inProgress = true;
      return of(true);
    }
    return of(false);
  }

  markFamilyCompleted(familyId: number): Observable<boolean> {
    // Mark family as completed in the database
    return this.http.post<any>(`${this.apiUrl}/families/${familyId}/complete`, {
      userId: 1 // Default user ID for now
    });
  }

  resetFamily(familyId: number): Observable<boolean> {
    const family = this.wordFamilies.find(f => f.id === familyId);
    if (family) {
      family.completed = false;
      family.inProgress = false;
      family.wordsLearned = 0;
      family.words.forEach((word: SpellingWord) => word.mastered = false);
      return of(true);
    }
    return of(false);
  }

  getReviewSentences(familyId: number): Observable<string[]> {
    // Fetch review sentences from the database
    return this.http.get<string[]>(`${this.apiUrl}/families/${familyId}/sentences`);
  }
}
