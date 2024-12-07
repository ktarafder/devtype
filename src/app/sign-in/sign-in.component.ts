import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  email: string = '';
  password: string = '';

  private http = inject(HttpClient);
  private router = inject(Router);


  onSignIn() {
    const formSubmitData = {
      email: this.email,
      password: this.password,
    };

    this.http.post('http://localhost:8080/api/v1/login', formSubmitData).subscribe({
      next: (response: any) => {
        // Assuming the token is in response.token
        if (response && response.token) {
          localStorage.setItem('jwtToken', response.token); // Save token to localStorage
          console.log('JWT Token saved to localStorage');
          this.router.navigate(['/']);
        } else {
          console.error('Token not found in response');
        }
      },
      error: (error) => {
        console.error('Error during signin', error);
      }
    });
  }
}
