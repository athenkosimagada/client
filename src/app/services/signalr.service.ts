import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../environments/environment';
import { Message } from '../models/message';
import { MessageRequest } from '../models/message-request';
import { AuthService } from './auth.service';
import { MessageService } from './message.service';
@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  connection!: signalR.HubConnection;
  SIGNALR_URL:string = environment.signalR_URL;

  constructor(
    private authService : AuthService,
    private messageService : MessageService,
    private authServce : AuthService
  ) { }

  startConnection():void {
    this.connection = new signalR.HubConnectionBuilder()
    .withUrl(this.SIGNALR_URL, {
      skipNegotiation : true,
      transport: signalR.HttpTransportType.WebSockets
    }).build();

    this.connection
    .start()
    .then(() => {
      console.log('Hub Connection Started');
      this.onLoggedIn();
      this.recieveMessage();
    })
    .catch(err => {
      console.log('Error while starting connection: ' + err)
    })
    .finally(() => {
      this.onLogin();
    })
  }
  getUserDetails() {
    return this.authService.getUserDetails();
  }
  

  async onLogin(){
    const userDetails = await this.authService.getUserDetails();
    this.connection.invoke("OnLogin", userDetails?.id)
    .catch(err => {
      console.log(err);
    });
  }

  onLoggedIn():void {
    this.connection.on("OnLoggedIn",(signalrConnectionId) => {
      console.log(signalrConnectionId);
    });
  }

  
  sendMessage(message: Message): void {
    console.log("Send Message Called");
  
    if (this.connection.state 
      !== signalR.HubConnectionState.Connected) {
      this.startConnection()
    }

    this.messageService.addMessage(message);
      this.connection.invoke("SendMessage", message, message.toUserId).then(() => {
        console.log("Message sent");
      })
      .catch(err => console.log(err));
  }  

  recieveMessage():void {
    this.connection.on("RecieveMessage",(message : Message) => {
      console.log(`Message received \n Message: ${message}`);
      this.messageService.receiveMessage(message);

        this.authService.users$.subscribe(users => {
        const updatedUsers = users.map(user => {
          if (user.id === message.toUserId) {
            return {
              ...user,
              latestMessage: message
            };
          } else {
            return user;
          }
        });
        this.authService.updateChatUsers(updatedUsers);
      });
    });
  }
}


