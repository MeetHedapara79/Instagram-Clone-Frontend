import { Component } from '@angular/core';
import { NotificationService } from './notification.service';
import { CookieService } from 'ngx-cookie-service';
import { DecodedToken, decodeToken } from '../../../utils/jwtdecode';
import { FollowUserSchema } from '../home-page/home-page.types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification',
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
})
export class NotificationComponent {
  suggestedUsers: { id: string; username: string; profilePic: string }[] = [];
  authToken: DecodedToken = { username: '', id: '', email: '' };
  defaultImage: string = 'https://storage.googleapis.com/a1aa/image/07245c34-77f4-4942-6bcd-50f96fa1bc49.jpg';

  constructor(
    public _notificationService: NotificationService,
    public _cookieService: CookieService
  ) {
    const myCookie = this._cookieService.get('authToken');
    this.authToken = decodeToken(myCookie);
  }

  ngOnInit(): void {
    this._notificationService
      .notificationList()
      .subscribe(
        (res: {
          data: { id: string; username: string; profilePic: string }[];
          message: string;
        }) => {
          this.suggestedUsers = res.data;
        }
      );
  }

  onConfirm(userId: string): void {
    this._notificationService
      .confirmFollow({ followerId: userId, followingId: this.authToken.id })
      .subscribe((res: { data: FollowUserSchema; message: string }) => {
        console.log('res :>> ', res);
        this.suggestedUsers = this.suggestedUsers.filter(
          (user) => user.id !== userId
        );
        // Optionally, you can add logic to update the UI or show a success message
      });
  }
}
