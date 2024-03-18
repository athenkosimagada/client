import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { SignalrService } from '../../services/signalr.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  form!:FormGroup;

  constructor(
    private fb : FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService,
    private signalrService: SignalrService,
    private router : Router
  ){

  }

  ngOnInit(): void {
    this.signalrService.startConnection();

    this.form =  this.fb.group({
      userName:new FormControl(null,  [
        Validators.required,
        Validators.email
      ]),
      password:new FormControl(null,  [
        Validators.required,
        Validators.minLength(6)
      ])
    });
  }

  onFormSubmit(){
    if(this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    this.authService.login(this.form.value).subscribe({
      next: (response) => {
        if(response.isSuccess){
          this.router.navigate(["cb/feed"]);
          this.toastr.success("Logged in Successfully")
        } else {
          this.toastr.error(response.message);
        }
      },
      error: (error) => {
        this.toastr.error(error.error.message);
      }
    })
  }
}
