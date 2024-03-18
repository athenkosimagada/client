import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ApplicationUser } from '../../models/user';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent implements OnInit {
  users:ApplicationUser[] = []

  constructor(
    private authService : AuthService,
    private toastr : ToastrService
  ){}

  ngOnInit(): void {
    this.authService.getUsers().subscribe({
      next: (res) => {
        if(res.isSuccess){
          this.users = res.result;
          console.log(this.users)
        }
        else {
          this.toastr.error(res.message);
        }
      },
      error: (err) => {
        this.toastr.error(err.error.message);
      }
    })
  }
}
