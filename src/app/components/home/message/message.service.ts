import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { io, Socket } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { DecodedToken, decodeToken } from '../../../utils/jwtdecode';
import { NewMessageSchema } from './message.types';
import { FollowingPostsSchema } from '../home-page/home-page.types';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  socket!: Socket;
  baseUrl = environment.apiUrl;
  messages: WritableSignal<NewMessageSchema[]> = signal([]);
  socketUrl = environment.socketUrl;
  authToken: DecodedToken = { username: '', id: '', email: '' };

  constructor(private http: HttpClient, public _cookieService: CookieService) {}

  connectSocket() {
    this.socket = io(this.socketUrl, { transports: ['websocket'] });
    this.socket?.on('connect', () => {
      console.log('Socket connected');
      const myCookie = this._cookieService.get('authToken');
      this.authToken = decodeToken(myCookie);

      // Register the userId with the server
      this.socket.emit('register_user', this.authToken.id);
    });
  }

  sendMessage(senderId: string, receiverId: string, content: string, postId:string | null) {
    this.socket.emit('send_message', { senderId, receiverId, content, postId });
  }

  listenForNewMessages(): Observable<NewMessageSchema> {
    return new Observable((observer) => {
      this.socket.on('new_message', (message: NewMessageSchema) => {
        observer.next(message);
      });
    });
  }

  joinConversation(conversationId: string) {
    this.socket.emit('join_conversation', conversationId);
  }

  findConversationId(conversationid: { userIds: string[] }) {
    return this.http.post<{ data: string; message: string }>(
      `${this.baseUrl}chat/findConversationId`,
      conversationid,
      { withCredentials: true }
    );
  }

  getMessages(conversationid: { userIds: string[] }) {
    return this.http.post<{ data: NewMessageSchema[]; message: string }>(
      `${this.baseUrl}chat/getMessages`,
      conversationid,
      { withCredentials: true }
    );
  }
}
