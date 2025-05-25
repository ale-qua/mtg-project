import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DeckComponent } from './deck/deck.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'deck', component: DeckComponent },
  { path: '**', component: NotFoundComponent }
];
