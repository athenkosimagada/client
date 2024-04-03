import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { LoginRequest } from '../models/login-request';
import { ApiResponse } from '../models/api-response';
import { LoginResponse } from '../models/login-response';
import { RegisterRequest } from '../models/register-request';
import { ApplicationUser } from '../models/user';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl:string = environment.AUTH_API_URL;
  JWT_TOKEN:string = "JWT_TOKEN";

  private usersSubject = new BehaviorSubject<ApplicationUser[]>([]);
  users$ = this.usersSubject.asObservable();

  constructor(
    private http:HttpClient,
    private router: Router
  ){}

  login(data:LoginRequest):Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/login`,data)
    .pipe(
      map((response) => {
        if(response.isSuccess){
          localStorage.setItem(this.JWT_TOKEN,response.result.token);
        }

        return response;
      })
    )
  }

  register(data:RegisterRequest):Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.apiUrl}/register`,data)
    .pipe(
      map((response) => {
        return response;
      })
    )
  }

  assignRole(data:RegisterRequest):Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.apiUrl}/AssignRole`,data)
    .pipe(
      map((response) => {
        return response;
      })
    )
  }

  getUsers():Observable<ApiResponse<ApplicationUser[]>>{
    return this.http.get<ApiResponse<ApplicationUser[]>>(`${this.apiUrl}/GetUsers`)
    .pipe(
      map((response) => {
        return response;
      })
    )
  }

  getChatUsers(userId: string):Observable<ApplicationUser[]>{
    return this.http.get<ApiResponse<ApplicationUser[]>>(`${this.apiUrl}/GetChatUsers/${userId}`)
    .pipe(
      map((response) => {
        console.log(response.result);
        this.usersSubject.next(response.result);
        return response.result || [];
      })
    )
  }

  updateChatUsers(message: Message): void {
    this.users$.pipe(take(1)).subscribe(users => {
      const updatedUsers = users.map(user => {
        if (user.id === message.fromUserId || user.id == message.toUserId) {
          return {
            ...user,
            latestMessage: message
          };
        }
        return user;
      });
      this.usersSubject.next(updatedUsers);
    });
  }

  getUserById(userId: string):Observable<ApplicationUser> {
    return this.http.get<ApiResponse<ApplicationUser>>(`${this.apiUrl}/GeyUserById/${userId}`)
    .pipe(
      map((response) => {
        return response.result;
      })
    );
  }

  getUserDetails = () => {
    const token = this.getToken();
    if(!token) return null;

    const decodedToken:any = jwtDecode(token);
    const userDetails = {
      id:decodedToken.sub,
      userName:decodedToken.actort,
      fullName:decodedToken.name,
      roles:decodedToken.role || []
    }

    return userDetails;
  }

  isLoggedIn = ():boolean => {
    const token = this.getToken();

    if(!token) return false;

    return !this.isTokenExpired();
  }

  private isTokenExpired() {
    const token = this.getToken();
    if(!token) return true;

    const decoded = jwtDecode(token);
    const isTokenExpired = Date.now() >= decoded['exp']! * 1000;
    if(isTokenExpired) this.logout();

    return isTokenExpired;
  }

  logout = (): void => {
    localStorage.removeItem(this.JWT_TOKEN);
    this.router.navigate(["/account/login"]);
  }

  private getToken = ():string | null => localStorage.getItem(this.JWT_TOKEN) || '';
}
