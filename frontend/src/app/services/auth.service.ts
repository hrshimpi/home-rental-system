import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

const AUTH_API = environment.apiBaseUrl;

const httpOptions = {
    headers: new HttpHeaders(
        {
            'Content-Type':'application/json',
            'Access-Control-Allow-Origin':'http://localhost:3001'
        },
    )
};

// Token storage note: sessionStorage (like localStorage) is plain JS-
// readable by ANY script running on the page, including an injected
// XSS payload - it offers no protection against token theft that
// way. It's used here to keep this a pure client-side SPA with no
// backend session state. The more defensible pattern for a real
// production app is an httpOnly cookie (unreadable from JS) paired
// with a CSRF token, which moves the trust boundary server-side.
const TOKEN_KEY = 'jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  jwtHelper = new JwtHelperService();
  constructor(
    private http:HttpClient,
    private router:Router
  ) { }
  // userStatus = new EventEmitter<boolean>();

  public isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  // updateStatus(status:boolean){
  //     this.userStatus.emit(status);
  // }

  login(email:string, password:string, role:string): Observable<any> {
    return this.http.post( AUTH_API + 'login', {
        email, password, role
    }, httpOptions );
  }

  signUp(email:string, password:string, name:string, mobile:number ,role:string):Observable<any> {
    return this.http.post( AUTH_API + 'signUp', {
        email, password, name, mobile, role
    }, httpOptions);
  }

  handleSignupSuccess() {
    this.router.navigate(['/login']);
  }

  handleLoginSuccess() {
    this.router.navigate(['/allProperties']);
    // window.location.reload();
  }

  setToken(token:string):void {
    sessionStorage.setItem(TOKEN_KEY, token);
  }

  getToken():string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  logout() {
    // this.updateStatus(false);
    sessionStorage.removeItem(TOKEN_KEY);
    this.router.navigate(['login']);
    console.log("jwt removed");
  }

  getId():any {
    const token = this.getToken();
    // console.log("this is token:", token);
    if (token ) {
        try {
            const decodedToken = this.jwtHelper.decodeToken(token);
            return {role:decodedToken.role, id:decodedToken.id};
        } catch {
            // Corrupted/malformed token - treat as not logged in rather
            // than letting the decode error propagate to the caller.
            return {};
        }
    }
    return {};
  }

  getUserProfile():Observable<any> {
    return this.http.get( AUTH_API + 'profile/' + this.getId().id);
  }
}
