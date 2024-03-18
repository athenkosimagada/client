import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../environments/environment';
import { Message } from '../models/message';
@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  connection!: signalR.HubConnection;
  SIGNALR_URL:string = environment.signalR_URL;

  constructor(
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
      this.connectionCreated();
      this.recieveMessage();
    })
    .catch(err => {
      console.log('Error while starting connection: ' + err)
    })
  }

  sendMessage(message:Message):void {
    console.log("Send Message Called");

    this.connection.invoke("SendMessage",message.messageId)
    .catch(err => {
      console.log(err);
    });
  }

  recieveMessage():void {
    this.connection.on("RecieveMessage",(recieverId) => {
      console.log(recieverId);
    });
  }

  createConnection(userId:string){
    this.connection.invoke("CreateConnection", userId)
    .catch(err => {
      console.log(err);
    });
  }

  connectionCreated():void {
    this.connection.on("ConnectionCreated",(connection) => {
      console.log(connection);
    });
  }
}


