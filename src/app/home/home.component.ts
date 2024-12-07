import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  private http = inject(HttpClient);
  private router = inject(Router);

  deleteAccount() {
    // Confirm user action before proceeding
    

    const userId = localStorage.getItem('userId'); // Assuming the user ID is stored in localStorage
    if (!userId) {
      console.error('User ID not found. Cannot delete account.');
      return;
    }

    this.http.delete(`http://localhost:8080/api/v1/delete`).subscribe({
      next: () => {
        alert('Your account has been successfully deleted.');
        localStorage.clear(); // Clear all user-related data
        this.router.navigate(['/signin']); // Redirect to the sign-in page
      },
      error: (error:any) => {
        console.error('Error deleting account:', error);
        alert('There was an error deleting your account. Please try again later.');
      }
    });
  }
}
