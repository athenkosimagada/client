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
    private messageService : MessageService
  ) { }

  startConnection():void {
    this.connection = new signalR.HubConnectionBuilder()
    .withUrl(this.SIGNALR_URL, {
      skipNegotiation : true,
      transport: signalR.HttpTransportType.WebSockets
    })
    .withAutomaticReconnect()
    .build();

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
  async sendMessage(message: Message): Promise<void> {
    try {
        await this.ensureConnection();
        this.messageService.addMessage(message);
        await this.connection.invoke("SendMessage", message, message.toUserId);
        console.log("Message sent");
    } catch (error) {
        console.error("Error sending message:", error);
    }
  }
  
  async ensureConnection(): Promise<void> {
      if (this.connection.state !== signalR.HubConnectionState.Connected) {
          await this.reconnect();
      }
  } 

  async reconnect(maxRetries = 5, currentRetry = 0) {
    if (!this.authService.isLoggedIn()) {
      console.log('User is logging out, skipping reconnection');
      return;
    }

    if (currentRetry >= maxRetries) {
      console.error('Failed to reconnect after', maxRetries, 'attempts');
      return;
    }
  
    const delay = Math.pow(2, currentRetry) * 1000;
    console.log(`Reconnecting in ${delay} ms... (attempt ${currentRetry + 1}/${maxRetries})`);
  
    try {
      await this.connection.start();
      console.log('Reconnected successfully');
      this.onLoggedIn();
      this.recieveMessage();
    } catch (error) {
      console.error('Reconnection failed:', error);
      await new Promise(resolve => setTimeout(resolve, delay));
      this.reconnect(maxRetries, currentRetry + 1);
    }
  }

  recieveMessage():void {
    this.connection.on("ReceiveMessage",(message : Message) => {
      console.log(`Message received \n Message: ${message}`);
      this.messageService.receiveMessage(message);
      this.authService.updateChatUsers(message);
    });
  }
}


