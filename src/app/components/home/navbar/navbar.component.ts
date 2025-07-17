import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { SearchComponent } from "../search/search.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, SearchComponent, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  showSearch = false;

  @ViewChild('drawerRef', { static: false }) drawerRef?: ElementRef;

  constructor(public _authService: AuthService, private router:Router, private host: ElementRef) {}

  toggleSearchDrawer(event: MouseEvent) {
    event.stopPropagation();
    this.showSearch = !this.showSearch;
  }

  navigateAndCloseDrawer(route: string) {
    this.router.navigate([route]);
    this.showSearch = false;
  }

  closeSearchDrawer() {
    this.showSearch = false;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const clickedInside = this.host.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.closeSearchDrawer();
    }
  }

  onLogout(){
    this._authService.logoutUser().subscribe((res) => {
    });
  }
}
