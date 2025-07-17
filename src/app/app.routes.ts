import { Routes } from '@angular/router';
import { SigninComponent } from './components/auth/signin/signin.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { HomeComponent } from './components/home/home.component';
import { CreateComponent } from './components/home/create/create.component';
import { ProfileComponent } from './components/home/profile/profile.component';
import { HomePageComponent } from './components/home/home-page/home-page.component';
import { NotificationComponent } from './components/home/notification/notification.component';
import { MessageComponent } from './components/home/message/message.component';
import { ReelsComponent } from './components/home/reels/reels.component';
import { SearchComponent } from './components/home/search/search.component';
import { TagComponent } from './components/home/profile/tag/tag.component';

export const routes: Routes = [
  { path: '', component: SigninComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgotpassword', component: ForgotPasswordComponent },
  { path: 'resetpassword', component: ResetPasswordComponent },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: 'homePage', component: HomePageComponent },
      { path: 'create', component: CreateComponent },
      { 
        path: 'profile', 
        component: ProfileComponent,
        children: [
         { path:'tag', component: TagComponent}
        ]
      },
      { path: 'notification', component: NotificationComponent },
      { path: 'message', component: MessageComponent },
      { path: 'reels', component: ReelsComponent },
      { path: 'profile/:id', component: ProfileComponent }
    ],
  },
];
