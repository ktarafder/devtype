import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngIf
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule], // Include CommonModule here
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {
  snippets: { id: number; text: string }[] = [
    { id: 1, text: `why are you` },
    { id: 2, text: `doing a lot` },
    { id: 3, text: `hello ella unnav` },
    { id: 4, text: `pichi patindha` },
    { id: 5, text: `nenu chesina` },
  ];
  currentSnippetIndex: number = 0;
  codeSnippet: string = '';
  currentSnippetId: number = 0;
  userInput: string = '';
  progress: number = 0;
  errors: number = 0;
  timeElapsed: number = 0; // in seconds
  timerInterval: any;

  // Metrics for overall session
  totalErrors: number = 0;
  totalCharacters: number = 0;
  totalTime: number = 0; // Total time across all snippets

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadNextSnippet();
    }
  }

  loadNextSnippet(): void {
    if (this.currentSnippetIndex < this.snippets.length) {
      const snippet = this.snippets[this.currentSnippetIndex];
      this.codeSnippet = snippet.text;
      this.currentSnippetId = snippet.id;
      this.resetGame();
    } else {
      this.endSession();
    }
  }

  onInputChange(event: any): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.userInput = event.target.value;

    // Calculate progress and errors
    this.calculateProgress();
    this.calculateErrors();

    // End snippet if completed
    if (this.progress === 100) {
      clearInterval(this.timerInterval);
      this.totalTime += this.timeElapsed;
      this.totalErrors += this.errors;
      this.totalCharacters += this.codeSnippet.length;

      // Send metrics to the server
      this.sendSnippetMetrics();

      this.currentSnippetIndex++;
      setTimeout(() => this.loadNextSnippet(), 1000); // Load next snippet after 1 second
    }
  }

  calculateProgress(): void {
    const typedLength = this.userInput.length;
    const totalLength = this.codeSnippet.length;
    this.progress = Math.min((typedLength / totalLength) * 100, 100);
  }

  calculateErrors(): void {
    this.errors = 0;
    for (let i = 0; i < this.userInput.length; i++) {
      if (this.userInput[i] !== this.codeSnippet[i]) {
        this.errors++;
      }
    }
  }

  startTimer(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.timerInterval = setInterval(() => {
        this.timeElapsed++;
      }, 1000);
    }
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  }

  calculateAccuracy(): number {
    const correctCharacters = this.totalCharacters - this.totalErrors;
    return ((correctCharacters / this.totalCharacters) * 100) || 0;
  }

  calculateSpeed(): number {
    return this.totalCharacters / (this.totalTime / 60); // Characters per minute
  }

  resetGame(): void {
    this.userInput = '';
    this.progress = 0;
    this.errors = 0;
    this.timeElapsed = 0;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.startTimer();
  }

  sendSnippetMetrics(): void {
    const token = localStorage.getItem('jwtToken'); // Retrieve the JWT token from localStorage
  
    if (!token) {
      console.error('JWT token not found. Cannot send metrics.');
      return;
    }
  
    const headers = {
      Authorization: `Bearer ${token}`, // Add Authorization header with the token
      'Content-Type': 'application/json', // Add Content-Type header
    };
  
    const data = {
      "overall_accuracy": this.calculateAccuracy(),
      "overall_speed": this.calculateSpeed(),
      "snippet_id": 1,
    };
  
    this.http
      .post(
        'https://b59f-73-207-37-247.ngrok-free.app/api/v1/typing-session',
        data,
        { headers } // Pass headers with the request
      )
      .subscribe({
        next: (response) => {
          console.log('Metrics sent successfully:', response);
        },
        error: (error) => {
          console.error('Error sending metrics:', error);
        },
      });
  }
  

  endSession(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    const accuracy = this.calculateAccuracy().toFixed(2);
    const speed = this.calculateSpeed().toFixed(2);
    alert(
      `Session Complete!\n\nAccuracy: ${accuracy}%\nSpeed: ${speed} characters per minute`
    );
  }
}
