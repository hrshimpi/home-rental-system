import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';

@Component({
    selector: 'app-my-chats',
    templateUrl: './my-chats.component.html',
    styleUrls: ['./my-chats.component.css'],
    standalone: false
})
export class MyChatsComponent implements OnInit, OnDestroy {
  
  @ViewChild('container', { static: false }) containerRef!: ElementRef;

  constructor(  
    private authService: AuthService,
    private chatService: ChatService,
  ) {}

  ngOnInit(): void {
    const user = this.authService.getId();
    if(user){
      this.id = user.id;
      this.role = user.role;
    }

    this.chatService.getChatList(this.id,this.role).subscribe(
      (data:any) => {
        this.chatList = data;
        console.log("Chat list",data);
      }
    )

    this.chatService.refreshChats.subscribe(() => {
      this.chatService.getChatByUserId(this.id, this.currentChatId).subscribe(
        (data:any) => {
          console.log(data);
          this.chats = data;
          console.log("chat loading works!",this.chats);
          this.scrollToBottom();
          // this.currentChatId = chatId;
        }
      )
    })

    this.startPolling();
  }

  private subscription!: Subscription;
  
  chats:any = [];
  chatList:any = [];
  reciever:any;
  id:string = '';
  role:string = '';
  message:string = '';
  currentChatId!:string;
  recieverName!:string;

  onSend():void {
    this.chatService.sendMessage(this.id,this.currentChatId,this.message).subscribe(
      (data:any) => {
        this.message = '';
        console.log(data);
        console.log("msg sent!");
        this.chatService.refreshChats.emit();
        this.scrollToBottom();
      }
    )
  }

  openChatById(chatId:string, recieverName:string):void {
    this.chatService.getChatByUserId(this.id, chatId).subscribe(
      (data:any) => {
        // console.log(data);
        this.chats = data;
        console.log("chat loading works!",this.chats);
        this.currentChatId = chatId;
        this.recieverName = recieverName
        this.scrollToBottom();
      }
    )
  }

  
  scrollToBottom() {
    const container = this.containerRef.nativeElement;
    container.scrollTop = container.scrollHeight;
  }

  ngOnDestroy() {
    this.stopPolling();
  }

  stopPolling() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  startPolling() {
    const pollingInterval = 3000; // Polling interval in milliseconds (adjust as needed)
  
    this.subscription = interval(pollingInterval)
      .subscribe(() => {
        this.chatService.refreshChats.emit();
      });
  }
}
