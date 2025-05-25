import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let message = 'Errore sconosciuto';
        if (error.error instanceof ErrorEvent) {
          message = `Errore client: ${error.error.message}`;
        } else {
          message = `Errore server: ${error.status} ${error.message}`;
        }
        alert(message);
        return throwError(() => new Error(message));
      })
    );
  }
}
