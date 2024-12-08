import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leaderboard',
  standalone: true, // Ensure this is a standalone component
  imports: [CommonModule], // Import CommonModule
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent {
  leaderboard = [
    { name: 'Alice Johnson', score: 1200, rank: 1 },
    { name: 'Bob Smith', score: 1150, rank: 2 },
    { name: 'Charlie Davis', score: 1100, rank: 3 },
    { name: 'Diana West', score: 1050, rank: 4 },
    { name: 'Evan Young', score: 1000, rank: 5 },
  ];
}
