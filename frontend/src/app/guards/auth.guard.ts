import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {
  jwtHelper = new JwtHelperService();
    
    constructor(
        private router:Router,
        private authService: AuthService,
    ) { }
    
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot){
      const token = this.authService.getToken();

      // JwtHelperService throws on a malformed token rather than
      // returning a boolean - treat that the same as "not logged in"
      // instead of letting it propagate and break navigation.
      let isValid = false;
      try {
          isValid = !!token && !this.jwtHelper.isTokenExpired(token);
      } catch {
          isValid = false;
      }

      if(isValid){
          // this.authService.updateStatus(true);
          this.authService.isUserLoggedIn.next(true);
          return true;
      }else{
          // this.authService.updateStatus(false);
          this.authService.isUserLoggedIn.next(false);
          this.router.navigate(['/login']);
          return false;
      }
  }
  
}
