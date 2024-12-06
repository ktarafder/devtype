import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngIf
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule], // Include CommonModule here
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  snippets: string[] = [
    `why are you`,
    `doing a lot`,
    `hello ella unnav`,
    `pichi patindha`,
    `nenu chesina`,
  ];
  currentSnippetIndex: number = 0;
  codeSnippet: string = '';
  userInput: string = '';
  progress: number = 0;
  errors: number = 0;
  timeElapsed: number = 0; // in seconds
  timerInterval: any;

  // Metrics for overall session
  totalErrors: number = 0;
  totalCharacters: number = 0;
  totalTime: number = 0; // Total time across all snippets

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadNextSnippet();
    }
  }

  loadNextSnippet(): void {
    if (this.currentSnippetIndex < this.snippets.length) {
      this.codeSnippet = this.snippets[this.currentSnippetIndex];
      this.resetGame();
    } else {
      // End session and show final metrics
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
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
