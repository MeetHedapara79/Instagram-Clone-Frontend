import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { SearchService } from './search.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SearchedUserSchema } from './search.types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  isOpen = false;
  searchForm: FormGroup;
  searchResults: SearchedUserSchema[] = [];
  defaultImage = 'https://storage.googleapis.com/a1aa/image/07245c34-77f4-4942-6bcd-50f96fa1bc49.jpg';

  private destroy$ = new Subject<void>();

  @Output() close = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private _searchService: SearchService,
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      query: ['']
    });
  }

  ngOnInit(): void {
    this.searchForm.get('query')?.valueChanges
      .pipe(
        debounceTime(500),
        takeUntil(this.destroy$)
      )
      .subscribe((query: string) => {
        this.searchUsers(query);
      });

    setTimeout(() => {
      this.isOpen = true;
    }, 0);
  }

  navigateToUserProfile(userId: string) {
    this.router.navigate(['home/profile/', userId]);
    this.close.emit();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  closeDrawer(): void {
    this.isOpen = false;
    this.close.emit();
  }

  searchUsers(query: string): void {
    if (!query.trim()) {
      this.searchResults = [];
      return;
    }

    this._searchService.searchUser(query).subscribe({
      next: (res) => {
        this.searchResults = res?.data || [];
      },
      error: (err) => {
        console.error('Search error:', err);
        this.searchResults = [];
      }
    });
  }
}
