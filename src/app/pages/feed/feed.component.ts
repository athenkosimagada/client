import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PostService } from '../../services/post.service';
import { ToastrService } from 'ngx-toastr';
import { Post } from '../../models/post';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { JsonPipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [
    RouterLink,
    NavbarComponent,
    ReactiveFormsModule
  ],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent {
  posts:Post[] = [];
  form!:FormGroup;

  constructor(
    private fb : FormBuilder,
    private authService : AuthService,
    private postService : PostService,
    private toastr : ToastrService
  ){

  }

  ngOnInit(): void {
    this.fetchPosts();

    this.form =  this.fb.group({
      postId: 0,
      userId: this.getUserDetails()?.id,
      likesCount: 0,
      commentsCount: 0,
      content:new FormControl(null,  [
        Validators.required
      ])
    });
  }

  fetchPosts(){
    this.postService.fetchPosts()
    .subscribe({
      next: (res) => {
        this.posts = res.result;
      },
      error: (err) => {
        this.toastr.error(err.error.message);
      }
    });
  }

  getUser(userId:string) {
    return this.authService.getUserById(userId);
  }

  getUserDetails() {
    return this.authService.getUserDetails();
  }

  post(){
    if(this.form.invalid) {
      this.toastr.error("Write something on the post")
      return;
    }

    this.postService.addPost(this.form.value).subscribe({
      next:(res) => {
        if(res.isSuccess){
          this.form.reset();
          this.fetchPosts();
          this.toastr.success("Post is created successfully");
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (err) => {
        this.toastr.error(err.error.message);
      }
    })
  }
}
