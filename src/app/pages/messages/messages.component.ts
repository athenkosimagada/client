import { AfterContentChecked, AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ApplicationUser } from '../../models/user';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from '../../services/message.service';
import { MessageRequest } from '../../models/message-request';
import { Message } from '../../models/message';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SignalrService } from '../../services/signalr.service';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent implements OnInit, AfterViewInit, AfterViewChecked {
  users: ApplicationUser[] = [];
  messages: Message[] = [];
  selectedUser: string = '';
  form!: FormGroup;
  id: string | null = '';

  @ViewChild('chatBody') chatBody!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private messageService: MessageService,
    private signalrService: SignalrService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.authService.getChatUsers(this.getUserDetails()?.id).subscribe({
      next: (users) => {
        if (users) {
          this.authService.users$.subscribe(users => {
            this.users = users;
          });
        } else {
          // Handle case where user with the ID is not found (optional)
        }
      },
      error: (err) => {
        this.toastr.error(err.error.message);
      }
    });
  }

  ngAfterViewInit(): void {
    this.signalrService.startConnection();

    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      
      if (this.id) {
        this.initializeForm();

        this.authService.getUserById(this.id).subscribe({
          next: (user) => {
            if (user) {
              this.getMessages(user);
              this.messageService.messages$.subscribe(messages => {
                this.messages = messages;
              });
            } else {
              // Handle case where user with the ID is not found (optional)
            }
          },
          error: (err) => {
            this.toastr.error(err.error.message);
          }
        });
      } else {
        this.messages = [];
        this.selectedUser = '';
      }
    });

    this.scrollToBottom();
  }

  initializeForm(): void {
    this.form = this.fb.group({
      messageId: '00000000-0000-0000-0000-000000000000',
      fromUserId: this.getUserDetails()?.id,
      toUserId: this.id ? this.id : this.getUserDetails()?.id,
      content: new FormControl(null, [Validators.required]),
      sentOn: new Date()
    });
  }

  scrollToBottom(): void {
    if (this.chatBody) {
      this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
    }
  }  

  getUserDetails() {
    return this.authService.getUserDetails();
  }
  
  getMessages(user: ApplicationUser): void {
    if (!user) {
      return;
    }

    this.selectedUser = user.fullName;
    const messageRequest: MessageRequest = {
      fromUserId: this.getUserDetails()?.id,
      toUserId: user.id
    }
    this.messageService.fetchMessages(messageRequest).subscribe({
      next: (response) => {
        if (!response.isSuccess) {
          this.toastr.error(response.message);
        }
      },
      error: (err) => {
        this.toastr.error(err.error.message);
      }
    });
  }

  sendMessage(): void {
    if (this.form.invalid) {
      this.toastr.error("Message can't be empty")
      return;
    }
    this.messageService.addMessage(this.form.value).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.authService.updateChatUsers(res.result);
          this.signalrService.sendMessage(res.result);
          this.initializeForm();
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (err) => {
        this.toastr.error(err.error.message);
      }
    })
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }
}