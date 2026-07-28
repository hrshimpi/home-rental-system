import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthErrorInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const isOwnApiRequest = req.url.startsWith(environment.apiBaseUrl);
        const isLoginRequest = req.url === environment.apiBaseUrl + 'login';

        // A 401 from /login itself just means "wrong credentials" -
        // that's the login form's own error to display, not a signal
        // that a session expired. Also refuse to act if we're already
        // on the login page, so a 401 there can never trigger another
        // redirect to itself (redirect-loop guard).
        if (
          error.status === 401 &&
          isOwnApiRequest &&
          !isLoginRequest &&
          !this.router.url.startsWith('/login')
        ) {
          this.authService.logout();
        }

        return throwError(() => error);
      })
    );
  }
}
