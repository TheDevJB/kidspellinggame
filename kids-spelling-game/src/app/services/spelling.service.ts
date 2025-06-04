import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface SpellingWord {
  id: number;
  word: string;
  difficulty: string;
  hint: string;
}

@Injectable({
  providedIn: 'root'
})
export class SpellingService {
  private apiUrl = 'http://localhost:3000/api/spelling';

  constructor(private http: HttpClient) { }

  getRandomWord(): Observable<SpellingWord> {
    return this.http.get<SpellingWord>(`${this.apiUrl}/word`);
  }

  checkSpelling(wordId: number, attempt: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/check`, { wordId, attempt });
  }
}
