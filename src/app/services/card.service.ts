import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export interface Card {
  id: string;
  name: string;
  imageUrl?: string;
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class CardService {
  private apiUrl = 'https://api.magicthegathering.io/v1/cards';

  constructor(private http: HttpClient) {}

  searchCards(name: string): Observable<{ cards: Card[] }> {
    return this.http
      .get<{ cards: Card[] }>(`${this.apiUrl}?name=${encodeURIComponent(name)}`)
      .pipe(
        catchError(err => {
          console.error('API error', err);
          return throwError(() => new Error('Errore durante il recupero delle carte'));
        })
      );
  }
}
