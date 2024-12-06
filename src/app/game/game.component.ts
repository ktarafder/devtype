import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {
  snippets: { id: number; text: string }[] = [];
  currentSnippetIndex: number = 0;
  codeSnippet: string = '';
  userInput: string = '';
  progress: number = 0;
  errors: number = 0;
  timeElapsed: number = 0;
  timerInterval: any;

  // Metrics for overall session
  totalErrors: number = 0;
  totalCharacters: number = 0;
  totalTime: number = 0;

  difficultySelected: boolean = false;
  selectedDifficulty: string = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId) && this.difficultySelected) {
      this.loadNextSnippet();
    }
  }

  selectDifficulty(difficulty: string): void {
    this.selectedDifficulty = difficulty;
    this.difficultySelected = true;
    this.fetchSnippets();
  }

  fetchSnippets(): void {
    const token = localStorage.getItem('jwtToken');
    const headers = {
      'Content-Type': 'application/json',
    };

    this.http
      .get<{ id: number; text: string }[]>(
        `https://b59f-73-207-37-247.ngrok-free.app/api/v1/snippets?difficulty=${this.selectedDifficulty}`,
      )
      .subscribe({
        next: (response) => {
          this.snippets = response;
          this.loadNextSnippet();
        },
        error: (error) => {
          console.error('Error fetching snippets:', error);
        },
      });
  }

  loadNextSnippet(): void {
    if (this.currentSnippetIndex < this.snippets.length) {
      const snippet = this.snippets[this.currentSnippetIndex];
      this.codeSnippet = snippet.text;
      this.resetGame();
    } else {
      this.endSession();
    }
  }

  onInputChange(event: any): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.userInput = event.target.value;
    this.calculateProgress();
    this.calculateErrors();

    if (this.progress === 100) {
      clearInterval(this.timerInterval);
      this.totalTime += this.timeElapsed;
      this.totalErrors += this.errors;
      this.totalCharacters += this.codeSnippet.length;

      this.sendSnippetMetrics();

      this.currentSnippetIndex++;
      setTimeout(() => this.loadNextSnippet(), 1000);
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
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  calculateAccuracy(): number {
    const correctCharacters = this.totalCharacters - this.totalErrors;
    return ((correctCharacters / this.totalCharacters) * 100) || 0;
  }

  calculateSpeed(): number {
    return this.totalCharacters / (this.totalTime / 60);
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
    const token = localStorage.getItem('jwtToken');
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const data = {
      overall_accuracy: this.calculateAccuracy(),
      overall_speed: this.calculateSpeed(),
      snippet_id: this.snippets[this.currentSnippetIndex].id,
    };

    this.http
      .post(
        'https://b59f-73-207-37-247.ngrok-free.app/api/v1/typing-session',
        data,
        { headers }
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
