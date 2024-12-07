import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AccountDetailsComponent } from '../account-details/account-details.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, MatDialogModule], // Add MatDialogModule here
})
export class HomeComponent {
  private http = inject(HttpClient);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  userFirstName: string | null = null;
  isLoggedIn: boolean = false;

  ngOnInit() {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.userFirstName = localStorage.getItem('firstName');
      this.isLoggedIn = !!this.userFirstName;
    }
  }

  openAccountDetails() {
    const token = localStorage.getItem('jwtToken');
    if (!token) return;

    this.http
      .get('http://localhost:8080/api/v1/user', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe((response: any) => {
        this.dialog.open(AccountDetailsComponent, {
          data: response, // Pass user details to the modal
          width: '400px', // Center and size the modal
          height: 'auto',
          disableClose: true, // Prevent closing on backdrop click
          hasBackdrop: true, // Enable backdrop overlay
          panelClass: 'custom-dialog-container', // Optional custom styling
        });
      });
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
