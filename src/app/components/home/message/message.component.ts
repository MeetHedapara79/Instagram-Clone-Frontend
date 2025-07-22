import { Component } from '@angular/core';
import { DecodedToken, decodeToken } from '../../../utils/jwtdecode';
import { ProfileService } from '../profile/profile.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from './message.service';
import { Subscription } from 'rxjs';
import { NewMessageSchema } from './message.types';
import { OpenPostComponent } from "./open-post/open-post.component";
import { FollowingPostsSchema } from '../home-page/home-page.types';

@Component({
  selector: 'app-message',
  imports: [CommonModule, ReactiveFormsModule, OpenPostComponent],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css',
})
export class MessageComponent {
  authToken: DecodedToken = { username: '', id: '', email: '' };
  defaultImage =
    'https://storage.googleapis.com/a1aa/image/07245c34-77f4-4942-6bcd-50f96fa1bc49.jpg';
  followingUserList: {
    id: string;
    username: string;
    profilePic: string | null;
  }[] = [];
  selectedUserData: {
    id: string;
    username: string;
    profilePic: string | null;
  } = {
    id: '',
    username: '',
    profilePic: null,
  };
  videoExtention:string[] = ["mp4", "quicktime", "x-msvideo", "x-ms-wmv", "x-flv", "webm"];
  messageForm: FormGroup;
  messageSubscription: Subscription | null = null;
  selectedPostIdForShow:NewMessageSchema | null = null;


  constructor(
    public _profileService: ProfileService,
    public _messageService: MessageService
  ) {
    const token = localStorage.getItem('authToken');
    this.authToken = decodeToken(token);

    this.messageForm = new FormGroup({
      content: new FormControl('', [
        Validators.required,
        // this.messageValidator,
      ]),
    });

    this._messageService.connectSocket();
  }

  ngOnInit(): void {
    this._profileService.followingList(this.authToken.id).subscribe((res) => {
      this.followingUserList = res.data;
    });
  }

  onSelect(user: { id: string; username: string; profilePic: string | null }) {
    // Reset previous conversation
    this._messageService.messages.set([]);
    this.selectedUserData = user;
    const userData = { userIds: [this.authToken.id, user.id] };

    // Fetch the previous messages
    this._messageService.getMessages(userData).subscribe((res) => {
      res.data = res.data.map((message) => ({
        ...message,
        timestamp: new Date(message.timestamp)
      }));
      this._messageService.messages.set(res.data);
    });

    // Find the conversation ID and join it
    this._messageService.findConversationId(userData).subscribe((res: { data: string, message: string }) => {
      this._messageService.joinConversation(res.data);

      // Unsubscribe from the previous message listener if it exists
      if (this.messageSubscription) {
        this.messageSubscription.unsubscribe();
      }

      // Subscribe to the real-time messages for this conversation
      this.messageSubscription = this._messageService.listenForNewMessages().subscribe((message: NewMessageSchema) => {
        this._messageService.messages.update((prev) => [...prev, message]);
      });
    });
  }

  messageValidator(control: FormControl): { [key: string]: boolean } | null {
    if (control.value.trim().length > 0) {
      return null;
    }
    return { invalidComment: true };
  }

  onSubmit() {
    if (this.messageForm.invalid) {
      console.log('Comment is Invalid');
      return;
    }

    const messageData = {
      ...this.messageForm.value,
      senderId: this.authToken.id,
      receiverId: this.selectedUserData.id,
    };
    this._messageService.sendMessage(messageData.senderId, messageData.receiverId, this.messageForm.value.content, null);


    this.messageForm.reset();
  }

  isValidURL(str:string) {
    try {
      new URL(str);
      return true;
    } catch (e) {
      return false;
    }
  }

  onShow(post:NewMessageSchema):void {
    this.selectedPostIdForShow = post;
  }
}
