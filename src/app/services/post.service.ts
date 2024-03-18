import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../models/api-response';
import { Post } from '../models/post';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  apiUrl:string = environment.POST_API_URL;

  constructor(private http : HttpClient) { }

  fetchPosts(): Observable<ApiResponse<Post[]>> {
    return this.http.get<ApiResponse<Post[]>>(`${this.apiUrl}/all`)
    .pipe(
      map((response) => {
        return response;
      })
    );
  }

  fetchUserPosts(userId : string): Observable<ApiResponse<Post[]>> {
    return this.http.get<ApiResponse<Post[]>>(`${this.apiUrl}/get-user-posts/${userId}`)
    .pipe(
      map((response) => {
        return response;
      })
    );
  }

  addPost(data : Post):Observable<ApiResponse<Post>> {
    return this.http.post<ApiResponse<Post>>(`${this.apiUrl}/create-post`,data);
  }

  updatePost(data : Post):Observable<ApiResponse<Post>> {
    return this.http.put<ApiResponse<Post>>(`${this.apiUrl}/update-post`,data);
  }

  getPost(postId : number):Observable<ApiResponse<Post>> {
    return this.http.get<ApiResponse<Post>>(`${this.apiUrl}/${postId}`);
  }

  deletePost(postId : number):Observable<ApiResponse<Post>> {
    return this.http.delete<ApiResponse<Post>>(`${this.apiUrl}/delete-post/${postId}`);
  }
}
