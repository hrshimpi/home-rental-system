import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

const AUTH_API = environment.apiBaseUrl;
const httpOptions = {
  // reportProgress:true, 
  // observe:'event',
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
export class OwnerService {

  constructor(
    private http:HttpClient,
    private authService:AuthService,
  ) { }
  o_id:string = this.authService.getId().id;

  addProperty(
    name:string, propertType:string, rent:number, deposite:number,
    address:string, landmark:string, tenantType:string,
    desc:string, roomAmenities:Array<any>, roomType:Array<any>, rules:Array<any>,
    photos:File[]
  ):Observable<any>{


    const formData:any = new FormData();
    formData.append('name', name);
    formData.append('propertType',propertType);
    formData.append('rent',rent)
    formData.append('deposite',deposite)
    formData.append('address',address)
    formData.append('landmark',landmark)
    formData.append('tenantType',tenantType)
    formData.append('desc',desc)
    formData.append('roomAmenities',JSON.stringify(roomAmenities))
    formData.append('roomType',JSON.stringify(roomType))
    formData.append('rules',JSON.stringify(rules))
    // formData.append('photos', photos) with photos as an array used to
    // serialize as the literal string "[object File]" per file -
    // browsers don't expand arrays into FormData. Append each file
    // separately under the same field name instead, which is what
    // multer.array('photos') on the backend actually expects.
    photos.forEach((file) => formData.append('photos', file));

//ngx-file-drop
    return this.http.post(AUTH_API + 'addProperty/' + this.o_id,
    // JSON.stringify(formData));
    formData);
    // {
    //     name,propertType,rent,deposite,
    //     address,landmark,desc,tenantType,
    //     roomAmenities,roomType, rules, photos
    // }
    // , httpOptions);
  }

  getMyProperties(o_id:string):Observable<any>{
    return this.http.get(AUTH_API + 'myProperties/' + o_id);
  }
  getAllProperties():Observable<any>{
    return this.http.get(AUTH_API + 'allProperties');
  }

  getPropertyDetails(p_id:string):Observable<any>{
    return this.http.get(AUTH_API + 'propertyDetails/' + p_id);
  }
}
