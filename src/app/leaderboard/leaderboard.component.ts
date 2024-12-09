import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class LeaderboardComponent implements OnInit {
  leaderboard: { first_name: string; last_name: string; rank: number; total_score: number }[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchLeaderboard();
  }

  fetchLeaderboard(): void {
    this.http
      .get<{ first_name: string; last_name: string; rank: number; total_score: number }[]>(
        'http://localhost:8080/api/v1/leaderboard'
      )
      .subscribe({
        next: (data) => {
          this.leaderboard = data;
        },
        error: (err) => {
          console.error('Error fetching leaderboard:', err);
        },
      });
  }
}
