import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { CardService, Card } from '../services/card.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, RouterModule],
  styleUrls: ['./home.component.css'],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  searchTerm = '';
  cards: Card[] = [];
  loading = false;
  error = '';

  constructor(private cardService: CardService) {}

  onSearch() {
    if (!this.searchTerm.trim()) return;
    this.loading = true;
    this.error = '';
    this.cardService.searchCards(this.searchTerm).subscribe({
      next: res => {
        this.cards = res.cards;
        this.loading = false;
      },
      error: err => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }
}
