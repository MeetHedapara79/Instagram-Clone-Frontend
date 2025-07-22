import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FollowingPostsSchema } from '../../home-page/home-page.types';
import { ProfileService } from '../../profile/profile.service';
import { CommonModule } from '@angular/common';
import { MessageService } from '../../message/message.service';
import { DecodedToken, decodeToken } from '../../../../utils/jwtdecode';

@Component({
  selector: 'app-share',
  imports: [CommonModule],
  templateUrl: './share.component.html',
  styleUrl: './share.component.css'
})
export class ShareComponent {
  @Input() reel!: FollowingPostsSchema;
  @Output() close = new EventEmitter<void>();
  authToken: DecodedToken = { username: '', id: '', email: '' };
  followingUserList:{ id: string; username: string; profilePic: string | null; }[] = [];
  defaultImage: string = 'https://storage.googleapis.com/a1aa/image/07245c34-77f4-4942-6bcd-50f96fa1bc49.jpg';

  constructor(public _profileService:ProfileService, public _messageService:MessageService){
    const token = localStorage.getItem('authToken');
    this.authToken = decodeToken(token);
  }

  ngOnInit(): void {
    this._profileService.followingList(this.authToken.id).subscribe((res)=>{
      this.followingUserList = res.data;
    });

    this._messageService.connectSocket();
  }

  onClose() {
    this.close.emit();
  }

  sharePost(userId:string){
    this._messageService.sendMessage(this.authToken.id, userId, this.reel.content, this.reel.id);
    this.onClose();
  }
}
