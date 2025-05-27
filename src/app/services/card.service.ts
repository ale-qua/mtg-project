import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Card {
  id: string;
  name: string;
  imageUrl: string;
  type?: string;
  description?: string;
  manaCost?: string;
  power?: string;
  toughness?: string;
  text?: string;
  rarity?: string;
  set?: string;
  setName?: string;
  artist?: string;
  flavor?: string;
  // aggiungi altri campi se necessario
}

@Injectable({
  providedIn: 'root'
})
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

  getCardById(id: string): Observable<Card> {
    return this.http
      .get<any>(`${this.apiUrl}/${encodeURIComponent(id)}`)
      .pipe(
        map(res => {
          console.log('API response:', res.card);
          if (res.card) {
            return res.card
          }
          throw new Error('Carta non trovata');
        }),
        catchError(err => {
          console.error('API error', err);
          return throwError(() => new Error('Errore durante il recupero della carta'));
        })
      );
  }
}
