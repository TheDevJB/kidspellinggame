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
}

@Injectable({
  providedIn: 'root'
})
export class SpellingService {
  private apiUrl = 'http://localhost:3000/api/spelling';

  // Sample word families (replace with API call in production)
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
    // In production, this would be an API call
    return of(this.wordFamilies);
  }

  getWordFamily(familyId: number): Observable<WordFamily | undefined> {
    return of(this.wordFamilies.find(family => family.id === familyId));
  }

  getRandomWord(familyId?: number): Observable<SpellingWord> {
    if (familyId) {
      const family = this.wordFamilies.find(f => f.id === familyId);
      if (family) {
        // Prioritize unmastered words
        const unmastered = family.words.filter(w => !w.mastered);
        if (unmastered.length > 0) {
          const randomIndex = Math.floor(Math.random() * unmastered.length);
          return of(unmastered[randomIndex]);
        }
        // If all words are mastered, pick any word
        const randomIndex = Math.floor(Math.random() * family.words.length);
        return of(family.words[randomIndex]);
      }
    }
    // Fallback to random word from all families
    const allWords = this.wordFamilies.flatMap(f => f.words);
    const randomIndex = Math.floor(Math.random() * allWords.length);
    return of(allWords[randomIndex]);
  }

  checkSpelling(wordId: number, attempt: string): Observable<any> {
    const allWords = this.wordFamilies.flatMap(f => f.words);
    const word = allWords.find(w => w.id === wordId);
    const isCorrect = word?.word.toLowerCase() === attempt.toLowerCase();
    
    if (word && isCorrect && !word.mastered) {
      word.mastered = true;
      const family = this.wordFamilies.find(f => f.id === word.familyId);
      if (family) {
        family.wordsLearned++;
        family.inProgress = true;
        if (family.wordsLearned === family.words.length) {
          family.completed = true;
          family.inProgress = false;
        }
      }
    }

    return of({
      correct: isCorrect,
      word: word
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
    const family = this.wordFamilies.find(f => f.id === familyId);
    if (family) {
      family.completed = true;
      family.inProgress = false;
      return of(true);
    }
    return of(false);
  }

  resetFamily(familyId: number): Observable<boolean> {
    const family = this.wordFamilies.find(f => f.id === familyId);
    if (family) {
      family.completed = false;
      family.inProgress = false;
      family.wordsLearned = 0;
      family.words.forEach(word => word.mastered = false);
      return of(true);
    }
    return of(false);
  }

  getReviewSentences(familyId: number): Observable<string[]> {
    const family = this.wordFamilies.find(f => f.id === familyId);
    if (family) {
      return of(family.words.map(word => word.exampleSentence));
    }
    return of([]);
  }
}
