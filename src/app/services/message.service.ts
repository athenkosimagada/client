import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../models/message';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response';
import { MessageRequest } from '../models/message-request';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  apiUrl = environment.MESSAGE_API_URL;

  constructor(private http : HttpClient) { }

  fetchMessages(data : MessageRequest):Observable<ApiResponse<Message[]>> {
    return this.http.post<ApiResponse<Message[]>>(`${this.apiUrl}/GetMessagesBetweenTwoUsers`,data);
  }
  addMessage(data : Message):Observable<ApiResponse<Message>> {
    return this.http.post<ApiResponse<Message>>(`${this.apiUrl}/AddMessage`,data);
  }
}
