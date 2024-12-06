import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

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

  onSignIn() {
    const formSubmitData = {
      email: this.email,
      password: this.password,
    };

    this.http.post('https://b59f-73-207-37-247.ngrok-free.app/api/v1/login', formSubmitData).subscribe({
      next: (response: any) => {
        // Assuming the token is in response.token
        if (response && response.token) {
          localStorage.setItem('jwtToken', response.token); // Save token to localStorage
          console.log('JWT Token saved to localStorage');
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
