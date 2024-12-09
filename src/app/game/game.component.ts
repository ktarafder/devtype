import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {
  snippets: { id: number; language: string; difficulty: string; text: string }[] = [];
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
  totalScore: number = 0;

  difficultySelected: boolean = false;
  selectedDifficulty: string = '';
  languageSelected: boolean = false;
  selectedLanguage: string = '';


  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient
  ) {}

  private router = inject(Router);

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

  selectLanguage(language: string): void {
    this.selectedLanguage = language;
    this.languageSelected = true;
  }

  fetchSnippets(): void {
    const headers = {
      'Content-Type': 'application/json',
    };
  
    this.http
      .get<{ id: number; language: string; difficulty: string; text: string }[]>(
        `http://localhost:8080/api/v1/snippets?difficulty=${this.selectedDifficulty}&language=${this.selectedLanguage}`,
        { headers }
      )
      .subscribe({
        next: (response) => {
          this.snippets = Array.isArray(response) ? response : [response];
          this.loadNextSnippet();
        },
        error: (error) => {
          console.error('Error fetching snippets:', error);
        },
      });
  }
  

  loadNextSnippet(): void {
    if (this.currentSnippetIndex < this.snippets.length) {
      this.codeSnippet = this.snippets[this.currentSnippetIndex].text;
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
    this.progress = Math.min((this.userInput.length / this.codeSnippet.length) * 100, 100);
  }

  calculateErrors(): void {
    this.errors = Math.max(
      this.errors,
      [...this.userInput].filter((char, i) => char !== this.codeSnippet[i]).length
    );
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

  calculateTotalScore(): number {
    // Base score per difficulty
    const baseScore =
      this.selectedDifficulty === 'easy' ? 10 :
      this.selectedDifficulty === 'medium' ? 20 :
      30;
  
    // Accuracy calculation with fallback for zero characters
    const accuracy = this.totalCharacters > 0 
      ? (this.totalCharacters - this.totalErrors) / this.totalCharacters 
      : 0;
  
    // Speed calculation with fallback for zero time
    const speed = this.totalTime > 0 
      ? this.totalCharacters / (this.totalTime / 60) 
      : 0;
  
    // Combine score factors
    const accuracyBonus = accuracy * 100; // Scale accuracy to percentage
    const speedBonus = speed; // Direct speed in characters per minute
  
    // Final score calculation
    const totalScore = (baseScore * this.snippets.length) + (accuracyBonus * 0.5) + (speedBonus * 0.5);
  
    return Math.round(totalScore);
    
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
      .post('http://localhost:8080/api/v1/typing-session', data, { headers })
      .subscribe({
        next: (response) => {
          console.log('Metrics sent successfully:', response);
        },
        error: (error) => {
          console.error('Error sending metrics:', error);
        },
      });
  }

  sendTotalScore(): void {
    const token = localStorage.getItem('jwtToken');
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const data = {
      total_score: this.totalScore,
    };

    this.http
      .post('http://localhost:8080/api/v1/game/finish', data, { headers })
      .subscribe({
        next: (response) => {
          console.log('Total score sent successfully:', response);
        },
        error: (error) => {
          console.error('Error sending total score:', error);
        },
      });
  }

  endSession(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.totalScore = this.calculateTotalScore(); // Call and assign the total score
  this.sendTotalScore();
  }

  restartSession() {
    this.router.navigate(['/']);
  }
}
