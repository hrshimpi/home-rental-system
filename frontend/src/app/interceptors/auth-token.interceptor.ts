import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only attach the token to requests going to our own API - never
    // to a third-party domain (an analytics script, Stripe's JS, a
    // maps API, etc.) that might get added to this app later.
    const isOwnApiRequest = req.url.startsWith(environment.apiBaseUrl);
    const token = this.authService.getToken();

    if (isOwnApiRequest && token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(req);
  }
}
