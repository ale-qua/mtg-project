import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardService, Card } from '../services/card.service';
import { inject } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  card: Card | undefined;
  loading = true;
  error = '';

  constructor(private route: ActivatedRoute, private cardService: CardService) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Card ID from route:', id);
    if (id) {
      this.cardService.getCardById(id).subscribe({
        next: res => {
          this.card = res;
          console.log('Card details:', this.card);
          this.loading = false;
        },
        error: err => {
          this.error = err.message;
          this.loading = false;
        }
      });
    } else {
      this.error = 'Invalid card id';
      this.loading = false;
    }
  }
}
