import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

const AUTH_API = 'http://localhost:3001/';

const httpOptions = {
    headers: new HttpHeaders(
        { 
            'Content-Type':'application/json',
            'Access-Control-Allow-Origin':'http://localhost:3001' 
        },
    )
};

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

  signUp(email:string, password:string, name:string, mobile:Number ,role:string):Observable<any> {
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

  logout() {
    // this.updateStatus(false);
    sessionStorage.removeItem('jwt');
    this.router.navigate(['login']);
    console.log("jwt removed");
  }

  getId():any {
    const token = sessionStorage.getItem('jwt');
    // console.log("this is token:", token);
    if (token ) { 
        const decodedToken = this.jwtHelper.decodeToken(token);
        return {role:decodedToken.role, id:decodedToken.id};
    }
    return {};
  }

  getUserProfile():Observable<any> {
    return this.http.get( AUTH_API + 'profile/' + this.getId().id);
  }
}
