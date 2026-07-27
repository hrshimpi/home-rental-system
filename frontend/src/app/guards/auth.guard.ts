import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  jwtHelper = new JwtHelperService();
    
    constructor(
        private router:Router,
        private authService: AuthService,
    ) { }
    
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot){
      const token = sessionStorage.getItem('jwt');

      if(token && !this.jwtHelper.isTokenExpired(token)){
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
