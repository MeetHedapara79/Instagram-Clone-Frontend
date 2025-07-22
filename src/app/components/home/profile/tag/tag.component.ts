import { Component } from '@angular/core';
import { ProfileService } from '../profile.service';
import { TagedPostList } from '../profile.types';
import { DecodedToken, decodeToken } from '../../../../utils/jwtdecode';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tag',
  imports: [CommonModule],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.css',
})
export class TagComponent {
  tagedPosts: TagedPostList[] = [];
  authToken: DecodedToken = { username: '', id: '', email: '' };
  videoExtention: string[] = [
    'mp4',
    'quicktime',
    'x-msvideo',
    'x-ms-wmv',
    'x-flv',
    'webm',
  ];

  constructor(
    public _profileService: ProfileService
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('authToken');
    this.authToken = decodeToken(token);
    this._profileService.getTagedPosts(this.authToken.id).subscribe((res)=>{
      this.tagedPosts = res.data;
    });
  }
}
