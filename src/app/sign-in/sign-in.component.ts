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

    this.http.post('https://albacore-rested-horse.ngrok-free.app/api/v1/login', formSubmitData).subscribe({
      next: (response) => {
        console.log('User signed in successfully', response);
      },
      error: (error) => {
        console.error('Error during signin', error);
      }
    });
  }
}
