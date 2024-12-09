import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule], // Add MatDialogModule here
})
export class HomeComponent {
  private http = inject(HttpClient);
  private router = inject(Router);

  userFirstName: string | null = null;
  isLoggedIn: boolean = false;

  ngOnInit() {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.userFirstName = localStorage.getItem('firstName');
      this.isLoggedIn = !!this.userFirstName;
    }
  }

  openAccountDetails() {
    this.router.navigate(['/account']);
  }

  logout() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('firstName');
    }
    this.isLoggedIn = false;
    this.userFirstName = null;
  }
}
