import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

const AUTH_API = 'http://localhost:3001/';
const httpOptions = {
    headers: new HttpHeaders(
        { 
            'Content-Type':'application/json',
            'Access-Control-Allow-Origin':['http://localhost:3001','http://localhost:9876' ]
        },
    )
};

@Injectable({
  providedIn: 'root'
})
export class TenantService {

  constructor(
    private http:HttpClient,
    private authService:AuthService,
  ) { }

  addReview(property_id:string, user_id:string, rating:number | null | undefined,comment:string | null | undefined ):Observable<any>{
    return this.http.post(AUTH_API + 'addReview',{
      property_id, user_id, rating, comment
    }, httpOptions);
  }

  getAllReviewByID(p_id:string):Observable<any>{
    return this.http.get(AUTH_API + 'reviews/' + p_id );
  }
}
