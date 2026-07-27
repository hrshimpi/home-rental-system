import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
export class ChatService {

  constructor(
    private http: HttpClient,
  ) { }

  refreshChats: EventEmitter<void> = new EventEmitter<void>();

  //for tenants(chat with owner) 
  createNewChat(tenantId:string, ownerId:string): Observable<any> {
    return this.http.post(AUTH_API + 'chat-with-owner', {
      tenantId, ownerId
    }, httpOptions);
  }

  //all
  sendMessage(senderId:string, chatId:string, msg:string): Observable<any> {
    return this.http.post(AUTH_API + 'msg', {
      senderId,chatId,msg
    }, httpOptions);
  }
  //all
  getChatList(userId:string, role:string):Observable<any> {
    return this.http.get(AUTH_API + 'get-chat-list/'+ role + '/' + userId);
  }
  //all
  getChatByUserId(userId:string, chatId:string):Observable<any> {
    return this.http.get(AUTH_API + 'get-chat-by-id/' + userId +'/'+ chatId);
  }

}
