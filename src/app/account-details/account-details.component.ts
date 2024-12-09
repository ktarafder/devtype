import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class AccountDetailsComponent implements OnInit {
  accountDetails: any = null;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const token = localStorage.getItem('jwtToken');
    if (!token) return;

    this.http
      .get('http://localhost:8080/api/v1/user', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe(
        (response) => {
          this.accountDetails = response;
        },
        (error) => {
          console.error('Failed to fetch account details:', error);
        }
      );
  }

  goBack() {
    this.router.navigate(['/']);
  }

  deleteAccount() {
    const token = localStorage.getItem('jwtToken');
    if (!token) return;

    this.http
      .delete('http://localhost:8080/api/v1/delete', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe(
        () => {
          alert('Account successfully deleted.');
          localStorage.removeItem('jwtToken');
          localStorage.removeItem('firstName');
          this.router.navigate(['/']);
        },
        (error) => {
          console.error('Failed to delete account:', error);
          alert('Failed to delete account. Please try again later.');
        }
      );
  }
}
