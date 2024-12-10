import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  firstName: string = '';
  lastName: string = '';
  username: string = '';
  email: string = '';
  password: string = '';

  private http = inject(HttpClient);
  private router = inject(Router);

  onSubmit() {
    const formData = {
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email,
      password: this.password,
    };

    this.http.post('http://localhost:8080/api/v1/register', formData).subscribe({
      next: (response) => {
        console.log('User signed up successfully', response);
        this.router.navigate(['/signin']);
      },
      error: (error) => {
        console.error('Error during signup', error);
      }
    });
  }
}
