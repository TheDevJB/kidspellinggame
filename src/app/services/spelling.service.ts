import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
  private currentFamilySubject = new BehaviorSubject<WordFamily | null>(null);
  public currentFamily$ = this.currentFamilySubject.asObservable();
  
  private currentWordIndexSubject = new BehaviorSubject<number>(0);
  public currentWordIndex$ = this.currentWordIndexSubject.asObservable();

  private wordFamilies: WordFamily[] = [
    {
      id: 1,
      name: 'AT',
      description: 'Words ending with -at sound',
      pattern: '_at',
      difficulty: 'easy',
      completed: false,
      in_progress: false,
      words_learned: 0,
      total_words: 8,
      words: [
        { id: 1, word: 'cat', family_id: 1, example_sentence: 'The cat is sleeping on the mat.', mastered: false },
        { id: 2, word: 'bat', family_id: 1, example_sentence: 'The baseball bat is made of wood.', mastered: false },
        { id: 3, word: 'hat', family_id: 1, example_sentence: 'She wore a red hat to the party.', mastered: false },
        { id: 4, word: 'mat', family_id: 1, example_sentence: 'Please wipe your feet on the mat.', mastered: false },
        { id: 5, word: 'rat', family_id: 1, example_sentence: 'The rat ran through the maze.', mastered: false },
        { id: 6, word: 'fat', family_id: 1, example_sentence: 'The fat cat ate too much food.', mastered: false },
        { id: 7, word: 'sat', family_id: 1, example_sentence: 'She sat on the comfortable chair.', mastered: false },
        { id: 8, word: 'pat', family_id: 1, example_sentence: 'Give the dog a gentle pat.', mastered: false }
      ]
    },
    {
      id: 2,
      name: 'AN',
      description: 'Words ending with -an sound',
      pattern: '_an',
      difficulty: 'easy',
      completed: false,
      in_progress: false,
      words_learned: 0,
      total_words: 8,
      words: [
        { id: 9, word: 'can', family_id: 2, example_sentence: 'I can ride my bike to school.', mastered: false },
        { id: 10, word: 'man', family_id: 2, example_sentence: 'The man walked his dog in the park.', mastered: false },
        { id: 11, word: 'pan', family_id: 2, example_sentence: 'Cook the eggs in a frying pan.', mastered: false },
        { id: 12, word: 'ran', family_id: 2, example_sentence: 'She ran as fast as she could.', mastered: false },
        { id: 13, word: 'fan', family_id: 2, example_sentence: 'Turn on the fan to cool the room.', mastered: false },
        { id: 14, word: 'tan', family_id: 2, example_sentence: 'His skin got tan from the sun.', mastered: false },
        { id: 15, word: 'van', family_id: 2, example_sentence: 'The delivery van arrived on time.', mastered: false },
        { id: 16, word: 'plan', family_id: 2, example_sentence: 'We need to make a plan for the trip.', mastered: false }
      ]
    },
    {
      id: 3,
      name: 'ING',
      description: 'Words ending with -ing sound',
      pattern: '_ing',
      difficulty: 'medium',
      completed: false,
      in_progress: false,
      words_learned: 0,
      total_words: 8,
      words: [
        { id: 17, word: 'sing', family_id: 3, example_sentence: 'The birds sing beautiful songs.', mastered: false },
        { id: 18, word: 'ring', family_id: 3, example_sentence: 'The phone will ring when someone calls.', mastered: false },
        { id: 19, word: 'king', family_id: 3, example_sentence: 'The king ruled the kingdom wisely.', mastered: false },
        { id: 20, word: 'wing', family_id: 3, example_sentence: 'The bird flapped its wing to fly.', mastered: false },
        { id: 21, word: 'bring', family_id: 3, example_sentence: 'Please bring your homework to class.', mastered: false },
        { id: 22, word: 'thing', family_id: 3, example_sentence: 'What is that strange thing over there?', mastered: false },
        { id: 23, word: 'spring', family_id: 3, example_sentence: 'Flowers bloom in the spring season.', mastered: false },
        { id: 24, word: 'swing', family_id: 3, example_sentence: 'The children love to swing at the playground.', mastered: false }
      ]
    }
  ];

  constructor() {}

  getWordFamilies(): WordFamily[] {
    return this.wordFamilies;
  }

  getWordFamily(familyId: number): WordFamily | null {
    return this.wordFamilies.find(f => f.id === familyId) || null;
  }

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
