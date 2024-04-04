import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Message } from '../models/message';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response';
import { MessageRequest } from '../models/message-request';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  apiUrl = environment.MESSAGE_API_URL;
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  messages$ = this.messagesSubject.asObservable();


  constructor(
    private http : HttpClient,
    private authService : AuthService
    ) { }

  fetchMessages(data : MessageRequest):Observable<ApiResponse<Message[]>> {
    return this.http.post<ApiResponse<Message[]>>(`${this.apiUrl}/GetMessagesBetweenTwoUsers`, data)
      .pipe(
        tap(response => {
          this.messagesSubject.next(response.result);
        })
      );
  }
  addMessage(data : Message):Observable<ApiResponse<Message>> {
    return this.http.post<ApiResponse<Message>>(`${this.apiUrl}/AddMessage`, data)
      .pipe(
        tap(response => {
          const updatedMessages = [...this.messagesSubject.value, response.result];
          this.messagesSubject.next(updatedMessages);
        })
      );
  }

  receiveMessage(message: Message) {
    this.authService.selectedUser$.subscribe(user => {
      if(user?.id == message.fromUserId) {
        const updatedMessages = [...this.messagesSubject.value, message];
        this.messagesSubject.next(updatedMessages);
      }
    });
  }

  getUserDetails() {
    return this.authService.getUserDetails();
  }
}
