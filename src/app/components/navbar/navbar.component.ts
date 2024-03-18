import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isActive:boolean = false;

  constructor(
    private authService : AuthService
  ){

  }

  getUserDetails() {
    return this.authService.getUserDetails();
  }

  dropdown() {
    this.isActive = !this.isActive;
  }

  logout() {
    this.authService.logout();
  }
}
