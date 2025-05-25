import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  template: `
    <h2>404 - Pagina non trovata</h2>
    <p>La pagina richiesta non esiste. <a routerLink="/">Torna alla Home</a></p>
  `
})
export class NotFoundComponent {}
