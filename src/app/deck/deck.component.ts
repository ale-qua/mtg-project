import { Component, OnInit } from '@angular/core';
import { CardService, Card } from '../services/card.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Deck {
  name: string;
  cards: { [cardId: string]: { card: Card; count: number } };
}

@Component({
  selector: 'app-deck',
  standalone: true,
  imports: [FormsModule, CommonModule],
  styleUrl: './deck.component.css',
  templateUrl: './deck.component.html'
})
export class DeckComponent implements OnInit {
  searchTerm = '';
  cards: Card[] = [];
  error = '';

  decks: Deck[] = [];
  selectedDeckIdx = 0;
  newDeckName = '';

  showSuccessAlert = false; // Alert verde per salvataggio

  constructor(private cardService: CardService) {}

  ngOnInit() {
    try {
      const saved = localStorage.getItem('myDecks');
      this.decks = saved ? JSON.parse(saved) : [];
    } catch {
      this.decks = [];
    }
    if (this.decks.length === 0) {
      this.addDeck('Main Deck');
    }
  }

  // Deck management
  addDeck(name?: string) {
    const deckName = (name || this.newDeckName.trim() || `Deck ${this.decks.length + 1}`).slice(0, 20);
    if (this.decks.some(deck => deck.name.toLowerCase() === deckName.toLowerCase())) {
      this.error = `A deck named "${deckName}" already exists.`;
      return;
    }
    this.decks.push({ name: deckName, cards: {} });
    this.selectedDeckIdx = this.decks.length - 1;
    this.newDeckName = '';
    this.error = '';
    this.persistDecks(); // <-- usa persistDecks qui!
  }

  onDeckNameInput() {
    const maxLen = 20;
    if (this.newDeckName && this.newDeckName.length > maxLen) {
      this.newDeckName = this.newDeckName.slice(0, maxLen);
    }
  }

  selectDeck(idx: number) {
    if (idx >= 0 && idx < this.decks.length) {
      this.selectedDeckIdx = idx;
    }
  }

  deleteDeck(idx: number) {
    if (idx < 0 || idx >= this.decks.length) return;
    this.decks.splice(idx, 1);
    if (this.decks.length === 0) {
      this.addDeck('Main Deck');
    }
    if (this.selectedDeckIdx >= this.decks.length) {
      this.selectedDeckIdx = this.decks.length - 1;
    }
    this.persistDecks();
  }

  // Card search
  onSearch() {
    if (!this.searchTerm.trim()) return;
    this.cards = [];
    this.error = '';
    this.cardService.searchCards(this.searchTerm).subscribe({
      next: res => (this.cards = res.cards),
      error: err => (this.error = err.message)
    });
  }

  // Card management
  addToDeck(card: Card) {
    const deck = this.selectedDeck;
    const totalCount = this.getDeckCardCount(deck);
    if (totalCount >= 100) {
      this.error = 'Hai raggiunto il limite massimo di 100 carte per mazzo.';
      setTimeout(() => (this.error = ''), 2500);
      return;
    }
    if (!deck.cards[card.id]) {
      deck.cards[card.id] = { card, count: 1 };
    } else {
      deck.cards[card.id].count++;
    }
    this.persistDecks(); // <-- solo persistenza, niente alert verde
  }

  removeFromDeck(card: Card) {
    const deck = this.selectedDeck;
    if (deck.cards[card.id]) {
      deck.cards[card.id].count--;
      if (deck.cards[card.id].count <= 0) {
        delete deck.cards[card.id];
      }
      this.persistDecks(); // <-- solo persistenza, niente alert verde
    }
  }

  // Salva SOLO quando clicchi esplicitamente su "Salva"
  saveDecks() {
    this.persistDecks();
    this.showSuccessAlert = true;
    setTimeout(() => {
      this.showSuccessAlert = false;
    }, 2000);
  }

  // Funzione di persistenza senza alert
  private persistDecks() {
    localStorage.setItem('myDecks', JSON.stringify(this.decks));
  }

  get selectedDeck(): Deck {
    return this.decks[this.selectedDeckIdx] ?? this.decks[0];
  }

  getDeckCardCount(deck: Deck): number {
    return Object.values(deck.cards).reduce((acc, entry) => acc + entry.count, 0);
  }

  trackByCard(_index: number, card: Card) {
    return card.id;
  }

  trackByDeck(_index: number, deck: Deck) {
    return deck.name;
  }

  trackByEntry(_index: number, entry: { key: string, value: any }) {
    return entry.key;
  }
}
