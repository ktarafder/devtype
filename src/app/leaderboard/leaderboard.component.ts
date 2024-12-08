import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css'],
})
export class LeaderboardComponent implements OnInit {
  leaderboard: { name: string; score: number; rank: number }[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchLeaderboard();
  }

  fetchLeaderboard(): void {
    this.http.get<{ name: string; score: number; rank: number }[]>('http://localhost:8080/api/v1/leaderboard')
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
